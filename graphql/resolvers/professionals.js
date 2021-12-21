const Professional = require('../../models/professional');

const { transformProfessional } = require('./merge')

module.exports = {

    professionals: async() => {
        //this find method is provided by mongoose. if we execute the method with no filters, it'll retrieve all the Event objects it finds.
        try {
            const professionals = await Professional.find() //.populate('creator')
                //this mapping is done to leave out all the metadata that mongoose generates. this is done using the _doc property (also provided by mongoose)
            return professionals.map(professional => {
                //this _id part is to overwrite the original _id retrieved in _doc, becasue GraphQL doesn't "understand" the special datatype that _id is originally.
                return transformProfessional(professional);
            });
        } catch (err) {
            throw err;
        }
    },

    createProfessional: async(args) => {

        const professional = new Professional({
            name: args.professionalInput.name,
            lastname: args.professionalInput.lastname,
            price: +args.professionalInput.price,
            image: args.professionalInput.image

        })
        let createdProfessional;
        try {
            const result = await professional.save()
            createdProfessional = transformProfessional(result);
            return createdProfessional;
        } catch (err) {
            console.log(err)
            throw err;
        }

    }

}