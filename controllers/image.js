const handleImage = (db) => (req, res) => {
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
		.catch(err => res.status(400).json('error getting user'));
}

module.exports = {
	handleImage
};