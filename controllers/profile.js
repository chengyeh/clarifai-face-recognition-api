const handleProfile = (db) => (req, res) => {
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
	.catch(err => res.status(400).json('error getting user'));
};

module.exports = {
	handleProfile
};