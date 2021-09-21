const mongoose = require('mongoose');
const { genreSchema } = require('./genre.model');

const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    genre: {
        type:genreSchema,
        required:true
    },
    numberInStock: {
        type: Number,
        required: true
    },
    dailyRentalRate: {
        type: Number,
        required: true
    }
})

const Movies = mongoose.model('Movies', moviesSchema);
module.exports.Movies = Movies;