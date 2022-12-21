const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://writerDb:wwXvnIBFavAegLrQ@cluster0.fceds.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJWT(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).send({ message: 'Unauthorized request' });
        }
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({ message: 'Unauthorized request' });
            }
            req.decoded = decoded;
            next();
        });
    })
}

async function run() {
    try {
        const serviceCollection = client.db("getYourWriter").collection("services");
        const reviewCollection = client.db("getYourWriter").collection("reviews");

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
            res.send({ token });
        })

        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            // const services = await cursor.toArray();
            // const cursor = serviceCollection.find(query).sort({ _id: -1 });
            const services = await (cursor.limit(3).toArray());
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.send(service);
        });

        app.get('/allservices', async (req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query);
            const allServices = await cursor.limit(6).toArray();
            res.send(allServices);
        });

        app.post('/addservice', async (req, res) => {
            const serviceinfo = req.body;
            const result = await serviceCollection.insertOne(serviceinfo);
            res.json(result);
        })

        app.post('/reviews', verifyJWT, async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        });

        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        });

        // Update review 

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
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            // const decoded = req.decoded;
            // console.log('review api called', decoded);
            // if (decoded.email !== req.query.email) {
            //     res.status(401).send({ message: 'Unauthorized request' });
            // }

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

