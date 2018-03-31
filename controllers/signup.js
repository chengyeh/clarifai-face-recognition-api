const handleSignup = (bcrypt, db) => (req, res) => {
	const { name, email, password } = req.body;
	const nameValid = name.match(/^[a-z ,.'-]+$/i);
	const emailValid = email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
	const passwordValid = password.length >= 6;
	
	if(!nameValid || !emailValid || !passwordValid) {
		return res.status(400).json('incorrect form input');
	}

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
							.then(user => res.json(user[0]));
				})
				.then(trx.commit)
				.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to sign up'));
	});
};

module.exports = {
	handleSignup
};