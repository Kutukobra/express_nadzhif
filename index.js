const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());

// app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.sendStatus(200);
});

app.use('/store', require('./src/routes/store.route'));

app.use('/user', require('./src/routes/user.route'));

app.use('/item', require('./src/routes/item.route'));

app.use('/transaction', require('./src/routes/transaction.route'));

app.listen(
    PORT,
    () => console.log(`Server running on http://localhost:${PORT}`)
);