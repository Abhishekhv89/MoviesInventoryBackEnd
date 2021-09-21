const express = require('express');
const Joi = require('joi');
const app = express.Router();
const { Genre } = require('../models/genre.model');

app.get('/', async (req, res) => {
    const genres = await Genre.find();
    res.send(genres);
});

app.post('/', async (req, res) => {
    const { error } = validateGenre(req);
    if (error) return res.status(404).send(error.details[0].message);

    const genre = new Genre({
        name: req.body.name
    })

    await genre.save();
    res.send(genre);
});

function validateGenre(req) {
    const schema = Joi.object({
        name: Joi.string().min(1).max(100).required()
    })

    return schema.validate(req.body);
}

module.exports = app;