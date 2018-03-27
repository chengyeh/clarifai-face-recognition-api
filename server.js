const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
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
let id = 3;

app.get('/', (req, res) => {
	res.json(database.users);
});

app.post('/signin', (req, res) => {
	const { email, password } = req.body;
	if(database.users[0].email === email && 
	   database.users[0].password === password) {
		res.json('Success')
	} else {
		res.status(400).json('User does not exist or enter the wrong password');
	}
});

app.post('/signup', (req, res) => {
	const { name, email, password } = req.body;
	database.users.push(
		{
			id: id,
			name: name,
			email: email,
			password: password,
			entries: 0,
			addedOn: new Date(),
		}
	)
	id++;
	res.json(database.users[database.users.length - 1]);
})

app.listen(3000, () => console.log('app is running on port 3000'));