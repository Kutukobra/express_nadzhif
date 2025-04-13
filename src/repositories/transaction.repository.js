const db = require('../database/pg.database');

exports.createTransaction = async (transaction) => {
    try {
        const data = await db.transaction(
            'INSERT INTO transactions (item_id, quantity, user_id, total) VALUES ($1, $2, $3, $4) RETURNING *',
            [transaction.item_id, transaction.quantity, transaction.user_id, transaction.total]
        );
        return data.rows[0];
    } catch (error) {
        if (error.constraint === 'transactions_user_id_fkey') {
            throw new Error('INVALID_USER_ID');
        }
        throw error;
    }
};

exports.payTransaction = async (id) => {
    try {
        const text = `WITH updated_users AS (\
                            UPDATE users \
                            SET balance = balance - transactions.total\
                            FROM transactions\
                            WHERE transactions.id = $1\
                            AND transactions.user_id = users.id\
                            AND users.balance >= transactions.total\
                            RETURNING users.id\
                        ),\
                        updated_items AS (\
                            UPDATE items\
                            SET stock = stock - 1\
                            FROM transactions\
                            WHERE transactions.id = $1\
                            AND transactions.item_id = items.id\
                            AND items.stock > 0\
                            RETURNING items.id\
                        )\
                        UPDATE transactions\
                        SET status = 'paid'\
                        WHERE id = $1\
                        AND status = 'pending'\
                        AND EXISTS (SELECT 1 FROM updated_users)\
                        AND EXISTS (SELECT 1 FROM updated_items)\
                        RETURNING *`;
        const data = await db.transaction(
            text,
            [id]
        );
        console.log(data.rows);
        return data.rows[0];
    } catch (error) {
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    const data = await db.transaction(
        'DELETE FROM transactions WHERE id = $1 RETURNING *',
        [id]
    );
    return data.rows[0];
};

exports.getAllTransactions = async () => {
    const text = `SELECT \
                    user_id,\
                    item_id,\
                    quantity,\
                    total,\
                    status,\
                    created_at,\
                    (\
                        SELECT json_agg(json_build_object(\
                            'id', users.id,\
                            'name', users.name,\
                            'email', users.email,\
                            'password', users.password,\
                            'balance', users.balance,\
                            'created_at', users.created_at\
                        ))\
                        FROM users\
                        WHERE\
                            users.id = transactions.user_id\
                    ) as user,\
                    (\
                        SELECT json_agg(json_build_object(\
                            'id', items.id,\
                            'name', items.name,\
                            'price', items.price,\
                            'store_id', items.store_id,\
                            'image_url', items.image_url,\
                            'stock', items.stock,\
                            'created_at', items.created_at\
                        ))\
                        FROM items\
                        WHERE \
                            items.id = transactions.item_id\
                    ) as item\
                    FROM transactions;`
    const data = await db.query(
        text
    );
    return data.rows;
}