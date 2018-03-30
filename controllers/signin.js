const handleSignin = (bcrypt, db) => (req, res) => {
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
		.catch(err => res.status(400).json('error getting user'));
};

module.exports = {
	handleSignin
};