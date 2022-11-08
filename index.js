const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const services = require('./data/services.json');
const users = require('./data/users.json');
const reviews = require('./data/reviews.json');

const uri = `mongodb+srv://writerDb:wwXvnIBFavAegLrQ@cluster0.fceds.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db("getYourWriter").collection("services");
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}

run().catch(err => console.error(err));


app.get('/services', (req, res) => {
    res.send(services);
})

app.get('/users', (req, res) => {
    res.send(users);
})
app.get('/reviews', (req, res) => {
    res.send(reviews);
})

app.get('/', (req, res) => {
    res.send('Services Reviews is Running');
})

app.listen(port, () => {
    console.log(`Services Reviews is Running on port: ${port}`);
})

