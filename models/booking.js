const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    event: {
        type: Schema.Types.ObjectId,
        ref: 'Event'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

    //this second parameter passed to the schema constructor let us set up the option to automatically add the timestamp at which the booking object was created in the db (createdAt and updatedAt fields are added).
}, { timestamps: true })


module.exports = mongoose.model('Booking', bookingSchema)