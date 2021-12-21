exports.downloadImage = (filename) => {
    const { Storage } = require("@google-cloud/storage");

    const gcconfig = {
        projectId: "origen-967ef.appspot.com",
        keyFilename: "C:/Users/User/Documents/dev/web_development/booking_app/graphql-react-event-booking/functions/origen-967ef-firebase-adminsdk-nfgou-3fff43125d.json"
    };
    const gcs = new Storage(gcconfig);
    gcs.bucket('gs://origen-967ef.appspot.com').file(filename).makePublic()
    let imageUrl;
    setTimeout(() => {
        imageUrl = gcs.bucket('gs://origen-967ef.appspot.com').file(filename).publicUrl()
        console.log(imageUrl)
    }, 2000)

    return imageUrl
}