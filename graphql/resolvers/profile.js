const Profile = require('../../models/profile');
const User = require('../../models/user')
const { transformProfile } = require('./merge')


module.exports = {
    profiles: async() => {
        //this find method is provided by mongoose. if we execute the method with no filters, it'll retrieve all the Event objects it finds.
        try {
            const profiles = await Profile.find() //.populate('creator')
                //this mapping is done to leave out all the metadata that mongoose generates. this is done using the _doc property (also provided by mongoose)
            return profiles.map(profile => {
                //this _id part is to overwrite the original _id retrieved in _doc, becasue GraphQL doesn't "understand" the special datatype that _id is originally.
                return transformProfile(profile);
            });
        } catch (err) {
            throw err;
        }
    },

    createProfile: async(args) => {

        const profile = new Profile({
            name: args.profileInput.name,
            lastname: args.profileInput.lastname,
            dni: +args.profileInput.dni,
            birthday: new Date(args.profileInput.birthday),
            user: args.profileInput.userId,
            image: args.profileInput.image

        })

        let createdProfile;
        //return createdProfile = transformProfile(result);

        try {
            const result = await profile.save()
            createdProfile = transformProfile(result);
            const user = await User.findById(args.profileInput.userId);
            console.log(createdProfile);
            user.profile = createdProfile._id;
            // mongoose handles this event object that I 'm passing as an argument.
            await user.save();
            console.log(user.profile)
            return transformProfile(result);
        } catch (err) {
            console.log(err)
            throw err;
        }

    }
}