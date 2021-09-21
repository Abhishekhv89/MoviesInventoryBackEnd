const mongoose = require('mongoose');
const express = require('express');
const movies = require('./routes/movies.route');
const genres = require('./routes/genre.route');
const users = require('./routes/registration.route');
const login = require('./routes/login.route');
const cors = require('cors')
const app = express();

mongoose.connect('mongodb://localhost/Movies')
    .then(() => { console.log('Connected to the DB') })
    .catch(() => { console.error('There is a Error in Connecting to the DB') });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))

app.use(cors())

app.use('/api/movies', movies);
app.use('/api/genres', genres);
app.use('/api/users', users);
app.use('/api/login',login);



const port = process.env.PORT || 5200;
app.listen(port, () => { console.log(`Listening to the PORT ${port}`) })



