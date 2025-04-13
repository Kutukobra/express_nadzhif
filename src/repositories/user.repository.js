const db = require('../database/pg.database');
const { use, param } = require('../routes/store.route');
const baseResponse = require('../utils/baseResponse.util');

exports.registerUser = async (user) => {
    try {
        const text = 'INSERT INTO users \
                        (email, password, name) \
                        VALUES ($1, $2, $3) \
                        RETURNING *'
        const params = [user.email, user.password, user.name];
        const data = await db.transaction(text, params);
        return data.rows[0];
    } catch (error) {
        if (error.constraint === 'users_email_key') {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
        throw error;
    }
};

exports.loginUser = async (user) => {
    const text = 'SELECT * \
                    FROM users \
                    WHERE email = $1';
    const params = [user.email];
    const data = await db.query(text, params);
    return data.rows[0];
};

exports.getUserByEmail = async (email) => {
    const data = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return data.rows[0];
};

exports.updateUser = async (user) => {
    try {
        const text = 'UPDATE users SET \
                        email = $2, \
                        password = $3, \
                        name = $4 \
                        WHERE id = $1\
                        RETURNING *';
        const params = [
            user.id,
            user.email,
            user.password,
            user.name
        ];
        const data = await db.transaction(text, params);
        return data.rows[0];
    } catch (error) {
        if (error.constraint === 'users_email_key') {
            throw new Error('EMAIL_ALREADY_EXISTS');
        }
        throw error;
    }
};

exports.deleteUser = async (id) => {
    const data = await db.transaction(
        'DELETE FROM users WHERE id = $1 RETURNING *',
        [id]
    );
    return data.rows[0];
}

exports.topUp = async (topUp) => {
    const text = 'UPDATE users \
                    SET balance = balance + $2\
                    WHERE id = $1\
                    RETURNING *';
    const params = [topUp.id, topUp.amount];
    const data = await db.transaction(text, params);
    return data.rows[0];
}