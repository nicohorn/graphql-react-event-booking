const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    createdEvents: [{
        //ObjectId is an special datatype that mongoose/MongoDB uses for FK and stuff
        type: Schema.Types.ObjectId,
        //ref is the keyword that mongoose uses to do relations (connection) between objects/models
        ref: 'Event'
    }]
});

module.exports = mongoose.model('User', userSchema);