const functions = require("firebase-functions");
const os = require("os");
const path = require("path");
const cors = require("cors")({ origin: true });
const Busboy = require("busboy");
const fs = require("fs");
const { Storage } = require("@google-cloud/storage");

const gcconfig = {
    projectId: "origen-967ef.appspot.com",
    keyFilename: "./origen-967ef-firebase-adminsdk-nfgou-3fff43125d.json"
};
const gcs = new Storage(gcconfig);




exports.uploadFile = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        if (req.method !== "POST") {
            return res.status(500).json({
                message: 'Not allowed'
            })
        }
        const busboy = new Busboy({ headers: req.headers })
        let uploadData = null;
        busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
            const filepath = path.join(os.tmpdir(), filename);
            uploadData = {
                file: filepath,
                type: mimetype,
                namefile: filename
            };
            file.pipe(fs.createWriteStream(filepath));
        })


        busboy.on("finish", () => {
            const bucket = gcs.bucket('origen-967ef.appspot.com')
            bucket.upload(uploadData.file, {
                uploadType: 'media',
                metadata: {
                    metadata: {
                        contentType: uploadData.type
                    }
                }
            }).then(() => {
                gcs.bucket('gs://origen-967ef.appspot.com').file(uploadData.namefile).makePublic()
            }).then(() => {
                const imageUrl = gcs.bucket('gs://origen-967ef.appspot.com').file(uploadData.namefile).publicUrl()
                console.log(imageUrl)

                res.status(200).json({
                    message: `Picture uploaded correctly`,
                    imageUrl: imageUrl
                })
            }).catch(err => {
                res.status(500).json({
                    error: err
                })
            });
        })

        busboy.end(req.rawBody);
    })
})