const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const services = require('./data/services.json');
// const users = require('./data/users.json');
// const reviews = require('./data/reviews.json');

const uri = `mongodb+srv://writerDb:wwXvnIBFavAegLrQ@cluster0.fceds.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db("getYourWriter").collection("services");
        const reviewCollection = client.db("getYourWriter").collection("reviews");

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });
        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const allServices = await cursor.toArray();
            res.send(allServices);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.json(result);
        });

        app.patch('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body;
            const query = { _id: ObjectId(id) };
            const newValues = { $set: { ...review } };
            const result = await reviewCollection.updateOne(query, newValues);
            res.send(result);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.json(result);
        })

        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = { email: req.query.email }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

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

