const db = require('../database/pg.database');

exports.createItem = async (item) => {
    console.log(item);
    try {
        const text = 'INSERT INTO items \
                        (name, price, store_id, image_url, stock, created_at) \
                        VALUES \
                        ($1, $2, $3, $4, $5, $6) \
                        RETURNING *';

        const params = [
            item.name,
            item.price,
            item.store_id,
            item.path,
            item.stock,
            item.created_at
        ];
        const data = await db.transaction(text, params);
        return data.rows[0];
    } catch (error) {
        if (error.constraint == 'items_store_id_fkey') {
            throw new Error('STORE_ID_NONEXISTENT');
        }
        throw error;
    }
};

exports.getAllItems = async () => {
    const data = await db.query(
        'SELECT * FROM items', 
        []
    );
    return data.rows;
};

exports.getItemById = async (id) => {
    const data = await db.query(
        'SELECT * FROM items WHERE id = $1',
        [id]
    );
    return data.rows[0];
};

exports.getItemsByStoreId = async (id) => {
    // Find store first
    const store = await db.query (
        'SELECT * FROM stores WHERE id = $1',
        [id]
    );

    if (store.rowCount === 0) {
        throw new Error('STORE_ID_NONEXISTENT');
    }

    const data = await db.query(
        'SELECT * FROM items WHERE store_id = $1',
        [id]
    );
    return data.rows;
};

exports.updateItem = async (item) => {
    try {
        const text = 'UPDATE items SET\
                        price = $2,\
                        store_id = $3,\
                        image_url = $4,\
                        stock = $5,\
                        created_at = $6\
                        WHERE id = $1\
                        RETURNING *';
        const params = [
            item.id,
            item.name,
            item.price,
            item.store_id,
            item.path,
            item.stock,
            item.created_at
        ];
        const data = await db.transaction(text, params);
        return data.rows[0];
    } catch (error) {
        if (error.constraint == 'items_store_id_fkey') {
            throw new Error('STORE_ID_NONEXISTENT');
        }
        throw error;
    }
};

exports.deleteItem = async (id) => {
    const data = await db.transaction(
        'DELETE FROM items WHERE id = $1 RETURNING *',
        [id]
    );
    return data.rows[0];
};