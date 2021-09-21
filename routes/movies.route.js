const express = require('express');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
const app = express.Router();
const { Genre } = require('../models/genre.model');
const { Movies } = require('../models/movies.model');
const auth = require('../middlewares/auth.middleware');
const admin = require('../middlewares/admin.middleware');

app.get('/', async (req, res) => {
    const movies = await Movies.find();
    res.send(movies);
});

app.get('/:id', async (req, res) => {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie with the given id is not found');
    res.send(movie);
});

app.post('/', [auth, admin], async (req, res) => {
    const { error } = validateMovie(req);
    if (error) return res.status(404).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genre);
    if (!genre) return res.status(404).send('Genre with the given id is not found');

    const movie = new Movies({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save();
    res.send(movie);
});

app.put('/:id', [auth, admin], async (req, res) => {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie with the given id is not found');

    const { error } = validateMovie(req);
    if (error) return res.status(404).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genre);
    if (!genre) return res.status(404).send('Genre with the given id is not found');

    movie.set({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save();
    res.send(movie);

});

app.delete('/:id', [auth, admin], async (req, res) => {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).send('Movie with the given id is not found');

    const deletedMovie = await Movies.findByIdAndDelete(req.params.id);
    res.send(deletedMovie);
});

function validateMovie(req) {
    const schema = Joi.object({
        title: Joi.string().min(1).max(100).required(),
        genre: Joi.objectId().required(),
        numberInStock: Joi.number().min(1).max(100).required(),
        dailyRentalRate: Joi.number().min(1).max(100).required()
    })

    return schema.validate(req.body);
}

module.exports = app;