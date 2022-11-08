const express = require('express');
const cors = require('cors');
const {MongoClient, ServerApiVersion} = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();
require('dotenv').config();
//*middlware
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
	app.get('/services', async (req, res) => {
		const medizCollection = client.db('mediz').collection('Services');
		const query = {};
		const cursor = medizCollection.find(query);
		const result = await cursor.toArray();
		res.send(result);
		console.log('🚀🚀: run -> result', result);
	});
}
run().catch((err) => console.log(err));
app.get('/', (req, res) => {
	res.send('Mediz-Server is Running');
});

app.listen(port, () => {
	console.log(`mediz-server is running on ${port}`);
});
