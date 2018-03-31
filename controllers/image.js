const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: 'abb52e751e454024a5dc3cf454ebb5b3'
});

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
};

const handleApiCall = (req, res) => {
	const { imageUrl } = req.body;
	
	 app.models.predict(Clarifai.FACE_DETECT_MODEL, imageUrl)
	 	.then(response => res.json(response))
	 	.catch(err => res.status(400).json('error connecting to api'))

};

module.exports = {
	handleImage,
	handleApiCall
};