require('dotenv').config();

const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING
});


const connect = async () => {
    try {
        await pool.connect();
        console.log('Connected to database.');
    } catch (error) {
        console.error('Error connecting to database', error);
    }
}

connect();

const query = async (text, params) => {
    try {
        const data = await pool.query(text, params);
        return data;
    } catch (error) {
        console.error('Error retrieving data.', error);
        throw error;
    }
};

const transaction = async (queryText, queryParam) => {
    try {
        await query('BEGIN');
        const data = await query(queryText, queryParam);
        await query('COMMIT');
        return data;
    } catch (error) {
        await query('ROLLBACK');
        console.error('Transaction error: ', error);
        throw error;
    }
};

module.exports = {
    query,
    transaction
}