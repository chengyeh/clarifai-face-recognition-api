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

app.get('/', (req, res) => {
	res.json(database.users);
});

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	db.select('*')
		.from('login')
		.where('email', email)
		.then(logoinInfo => {
			// Compare hash from the login table to the password user submit.
			bcrypt.compare(password, logoinInfo[0].hash, function(err, isValid) {
			    if(isValid) {
			    	db.select('*')
			    		.from('users')
			    		.where('email', email)
			    		.then(user => {
			    			res.json(user[0]);
			    		})
			    		.catch(err => res.status(400).json('error getting user'));
			    } else {
			    	res.status(400).json(`email and password don't match`);
			    }
			});
		})
		.catch(err => res.status(400).json('error getting user'))
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
							.returning('*')
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
				res.json(Number(entries[0]));
			} else {
				res.status(400).json('user not found');
			}
		})
		.catch(err => res.status(400).json('error getting user'))
})

app.listen(3001, () => console.log('app is running on port 3001'));