const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const services = require('./data/services.json');
const users = require('./data/users.json');

app.get('/services', (req, res) => {
    res.send(services);
})

app.get('/users', (req, res) => {
    res.send(users);
})

app.get('/', (req, res) => {
    res.send('Services Reviews is Running');
})

app.listen(port, () => {
    console.log(`Services Reviews is Running on port: ${port}`);
})

