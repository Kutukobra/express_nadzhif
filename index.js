const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const cors = require('cors');
const corsOptions = {
    origin: "os.netlabdte.com",
    methods: ["GET", "POST", "PUT", "DELETE"]
}

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