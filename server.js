const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex');
const signup = require('./controllers/signup');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'brianlee',
    password : '',
    database : 'face-recognition'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
	res.json(database.users);
});

app.post('/signin', signin.handleSignin(bcrypt, db));
app.post('/signup', signup.handleSignup(bcrypt, db));
app.get('/profile/:userId', profile.handleProfile(db)); 
app.put('/image', image.handleImage(db));
app.listen(3001, () => console.log('app is running on port 3001'));