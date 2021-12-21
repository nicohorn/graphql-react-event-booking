const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//same schema that is defined in the app.js (graphqlhttp)
const profileSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    dni: {
        type: Number,
        required: true
    },
    birthday: {
        type: Date,
        required: true
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

    image: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Profile', profileSchema);