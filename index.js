const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

//*middlware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
	res.send('Mediz-Server is Running');
});

app.listen(port, () => {
	console.log(`mediz-server is running on ${port}`);
});
