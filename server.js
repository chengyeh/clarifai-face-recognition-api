const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')

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

const database = {
	users: [
		{
			id: 1,
			name: 'Brian',
			email: 'brian@gmail.com',
			password: '1111',
			entries: 0,
			addedOn: new Date(),
		},
		{
			id: 2,
			name: 'Christina',
			email: 'christina@gmail.com',
			password: '2222',
			entries: 0,
			addedOn: new Date(),
		}
	]
};

const matchId = (req, res, id) => {
	let found = false;
	database.users.forEach(user => {
		if(user.id == id) {
			found = true;
			if(req.url === '/image') {
				user.entries++;
			} 
			return res.json(user);
		}
	})
	if(!found) {
		res.status(400).json('User not found');
	}
};

app.get('/', (req, res) => {
	res.json(database.users);
});

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if(database.users[0].email === email && 
	   database.users[0].password === password) {
		res.json(database.users[0]);
	} else {
		res.status(400).json('User does not exist or enter the wrong password');
	}u
});

app.post('/signup', (req, res) => {
	const { name, email, password } = req.body;
	db('users')
		.returning('*')
		.insert(
			{
				name: name,
				email: email,
				addedon: new Date(),
			}
		)
		.then(user => {
			res.json(user[0]);
		})
		.catch(err => res.status(400).json('unable to sign up'));
})

app.get('/profile/:userId', (req, res) => {
	const { userId } = req.params;
	matchId(req, res, userId);
}) 

app.put('/image', (req, res) => {
	const { id } = req.body;
	matchId(req, res, id);
})

app.listen(3001, () => console.log('app is running on port 3001'));