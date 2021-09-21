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
    if (error) return res.status(404).send(error.details[0].message);

    const registeredEmail = await Users.findOne({ email: req.body.email });
    if (registeredEmail) return res.status(400).send('User is already registered');

    const users = new Users({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        isAdmin: req.body.isAdmin ? req.body.isAdmin : false
    })

    const salt = await bcrypt.genSalt(10);
    users.password = await bcrypt.hash(users.password, salt);

    const token = await jwt.sign({ isAdmin: users.isAdmin, username: users.username }, 'jwtsecretkey');

    await users.save();
    res
        .header({ 'x-auth-token': token })
        .header("access-control-expose-headers", "x-auth-token")
        .send(users);
});

function validateUsers(req) {
    const schema = Joi.object({
        email: Joi.string().min(1).max(100).required(),
        username: Joi.string().min(1).max(100).required(),
        password: Joi.string().min(1).max(100).required()
    })

    return schema.validate(req.body);
}

module.exports = app;