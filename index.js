const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());

// *start Mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qh4qhby.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
});

async function run() {
	//*get all services
	const medizCollection = client.db('mediz').collection('Services');
	const reviewCollection = client.db('mediz').collection('Reviews');
	app.get('/services', async (req, res) => {
		//*set limit to load services
		const limit = parseInt(req.query.limit);
		const query = {};
		const cursor = medizCollection.find(query);
		if (limit) {
			const result = await cursor.limit(limit).toArray();
			res.send(result);
		} else {
			const result = await cursor.toArray();
			res.send(result);
		}
	});
	//*send service server to database
	app.post('/services', async (req, res) => {
		var isodate = new Date();
		var localDateTime = isodate.toLocaleDateString() + ' ' + isodate.toLocaleTimeString();
		const service = req.body;
		console.log('🚀🚀: run -> service', service);
		const fullServices = {...service, date: localDateTime};
		const result = await medizCollection.insertOne(fullServices);
		res.send(result);
	});
	//*get service by ID
	app.get('/service/:id', async (req, res) => {
		//*get Service Id
		const id = req.params.id;
		const query = {_id: ObjectId(id)};
		const result = await medizCollection.findOne(query);
		res.send(result);
	});
	//*send review server to database
	app.post('/review', async (req, res) => {
		var isodate = new Date();
		var localDateTime = isodate.toLocaleDateString() + ' ' + isodate.toLocaleTimeString();
		const review = req.body;
		const fullReview = {...review, date: localDateTime};
		const result = await reviewCollection.insertOne(fullReview);
		res.send(result);
	});
	//*get review by sevice id
	app.get('/review', async (req, res) => {
		const id = req.query.id;
		if (id) {
			query = {
				reviewID: id,
			};
		}
		const cursor = reviewCollection.find(query).sort({date: -1});
		const result = await cursor.toArray();
		res.send(result);
	});
	//*get myreviews by user email
	app.get('/myreviews', async (req, res) => {
		const email = req.query.email;
		if (email) {
			query = {
				email: email,
			};
		}
		const cursor = reviewCollection.find(query).sort({date: -1});
		const result = await cursor.toArray();
		res.send(result);
	});
	//*delete specific review by id
	app.delete('/myreviews/:id', async (req, res) => {
		const id = req.params.id;
		const query = {_id: ObjectId(id)};
		const result = await reviewCollection.deleteOne(query);
		res.send(result);
	});
	//*get specific review by id
	app.get('/review/:id', async (req, res) => {
		//*get review Id
		const id = req.params.id;
		const query = {_id: ObjectId(id)};
		const result = await reviewCollection.findOne(query);
		res.send(result);
	});
	app.put('/review/:id', async (req, res) => {
		const id = req.params.id;
		const review = req.body;
		console.log(review);
		const filter = {_id: ObjectId(id)};
		const option = {upsert: true};
		var isodate = new Date();
		var localDateTime = isodate.toLocaleDateString() + ' ' + isodate.toLocaleTimeString();
		const updateReview = {
			$set: {
				name: review.name,
				message: review.message,
				date: localDateTime,
			},
		};
		const result = await reviewCollection.updateOne(filter, updateReview, option);
		res.send(result);
	});
}
run().catch((err) => console.log(err));
app.get('/', (req, res) => {
	res.send('Mediz-Server is Running');
});

app.listen(port, () => {
	console.log(`mediz-server is running on ${port}`);
});
