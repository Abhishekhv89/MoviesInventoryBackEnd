const express = require('express');
const Joi = require('joi');
const app = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Users } = require('../models/registration.model');

app.get('/', async (req, res) => {
    const users = await Users.find();
    res.send(users);
});

app.post('/', async (req, res) => {
    const { error } = validateUsers(req);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await Users.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('User is not registered');

    const isPassword = await bcrypt.compare(req.body.password, user.password);
    if (!isPassword) return res.status(400).send('Password is not matching');

    const token = await jwt.sign({ isAdmin: user.isAdmin, username: user.username }, 'jwtsecretkey');

    res.send(token);
});

function validateUsers(req) {
    const schema = Joi.object({
        email: Joi.string().min(1).max(100).required(),
        password: Joi.string().min(1).max(100).required()
    })

    return schema.validate(req.body);
}

module.exports = app;