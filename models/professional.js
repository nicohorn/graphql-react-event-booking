const mongoose = require('mongoose');

const Schema = mongoose.Schema;


//same schema that is defined in the app.js (graphqlhttp)
const professionalSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    startTimeMorning: {
        type: String,
        required: true
    },
    endTimeMorning: {
        type: String,
        required: true
    },
    startTimeAfternoon: {
        type: String,
        required: true
    },
    endTimeAfternoon: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
});

module.exports = mongoose.model('Professional', professionalSchema);