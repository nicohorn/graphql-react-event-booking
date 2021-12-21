const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    professional: {
        type: Schema.Types.ObjectId,
        ref: 'Professional'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    startDate: {
        type: Date,
        required: true
    },

    endDate: {
        type: Date,
        required: true
    }

    //this second parameter passed to the schema constructor let us set up the option to automatically add the timestamp at which the booking object was created in the db (createdAt and updatedAt fields are added).
}, { timestamps: true })


module.exports = mongoose.model('Appointment', appointmentSchema)