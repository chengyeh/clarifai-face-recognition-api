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

	bcrypt.hash(password, null, null, function(err, hash) {
    	// Store hash in the user table.
    	db.transaction(trx => {
			trx('login')
				.insert({email, hash})
				.returning('email')
				.then(loginEmail => {
					return trx('users')
							.insert({
								name,
								email: loginEmail[0],
								addedon: new Date()
							})
							.returning(['name', 'email'])
							.then(user => res.json(user[0]))
				})
				.then(trx.commit)
				.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to sign up'));
	});
})

app.get('/profile/:userId', (req, res) => {
	const { userId } = req.params;
	db('users')
	.where('id', userId)
	.then(user => {
		if(user.length) {
			res.json(user[0]);
		} else {
			res.status(400).json('user not found');
		}
	})
	.catch(err => res.status(400).json('error getting user'))
}) 

app.put('/image', (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			if(entries.length) {
				res.json(entries[0])
			} else {
				res.status(400).json('user not found');
			}
		})
		.catch(err => res.status(400).json('error getting user'))
})

app.listen(3001, () => console.log('app is running on port 3001'));