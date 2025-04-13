const db = require('../database/pg.database.js');

exports.getAllStores = async () => {
    const data = await db.query(
        'SELECT * FROM stores'
    );
    return data.rows;
};

exports.createStore = async (store) => {
    const data = await db.transaction(
        'INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *', 
        [store.name, store.address]
    );
    return data.rows[0];
};

exports.getStoreById = async (id) => {
    const data = await db.query(
        'SELECT * FROM stores WHERE id = $1', 
        [id]
    );
    return data.rows[0];
};

exports.updateStore = async (store) => {
    const text = 'UPDATE stores SET \
                        name = $2, \
                        address = $3, \
                        created_at = $4 \
                        WHERE id = $1 RETURNING *';
    const params = [
        store.id, 
        store.name, 
        store.address, 
        store.created_at
    ];
    const data = await db.transaction(text, params);
    return data.rows[0];
};

exports.deleteStore = async (id) => {
    const data = await db.transaction(
        'DELETE FROM stores WHERE id = $1 RETURNING *', 
        [id]
    );
    return data.rows[0];
};