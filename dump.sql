CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS stores(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    balance INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *; 

SELECT * FROM stores WHERE id = $1;

UPDATE stores SET
name = $2,
address = $3,
created_at = $4
WHERE id = $1;

DELETE FROM stores WHERE id = $1;

INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING *;

SELECT * FROM users WHERE email = $1 AND password = $2

SELECT * FROM users WHERE email = $1;

UPDATE users SET
email = $2,
password = $3,
name = $4
WHERE id = $1;

DELETE FROM users WHERE id = $1 RETURNING *;

UPDATE users 
SET balance = balance + $2
WHERE id = $1
RETURNING *;

CREATE TABLE IF NOT EXISTS items(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    store_id UUID NOT NULL,
    image_url VARCHAR(255),
    stock INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

INSERT INTO items 
    (name, price, store_id, image_url, stock, created_at) 
    VALUES 
    ($1, $2, $3, $4, $5, $6) 
RETURNING *;

SELECT * FROM items;

SELECT * FROM items WHERE id = $1;

SELECT * FROM items WHERE store_id = $1;

UPDATE items SET
name = $2
price = $3,
store_id = $4,
image_url = $5,
stock = $6,
created_at = $7
WHERE id = $1
RETURNING *;

DELETE FROM items WHERE id = $1 RETURNING *;

CREATE type transaction_status AS ENUM ('pending', 'paid');
CREATE TABLE IF NOT EXISTS transactions(
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    item_id UUID NOT NULL,
    quantity INT NOT NULL,
    total INT NOT NULL,
    status transaction_status DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

INSERT INTO transactions (item_id, quantity, user_id) VALUES ($1, $2, $3) RETURNING *;

WITH updated_users AS (
    UPDATE users 
    SET balance = balance - transactions.total
    FROM transactions
    WHERE transactions.id = $1
    AND transactions.user_id = users.id
    AND users.balance >= transactions.total
    RETURNING users.id
),
updated_items AS (
    UPDATE items
    SET stock = stock - 1
    FROM transactions
    WHERE transactions.id = $1
    AND transactions.item_id = items.id
    AND items.stock > 0
    RETURNING items.id
)
UPDATE transactions
SET status = 'paid'
WHERE id = $1
AND status = 'pending'
AND EXISTS (SELECT 1 FROM updated_users)
AND EXISTS (SELECT 1 FROM updated_items);


WITH updated_users AS (
    UPDATE users 
    SET balance = balance - transactions.total
    FROM transactions
    WHERE transactions.id = '6b64bd57-e5ca-4c79-b878-351fb6f4807f'
    AND transactions.user_id = users.id
    AND users.balance >= transactions.total
    RETURNING users.id
),
updated_items AS (
    UPDATE items
    SET stock = stock - 1
    FROM transactions
    WHERE transactions.id = '6b64bd57-e5ca-4c79-b878-351fb6f4807f'
    AND transactions.item_id = items.id
    AND items.stock > 0
    RETURNING items.id
)
UPDATE transactions
SET status = 'paid'
WHERE id = '6b64bd57-e5ca-4c79-b878-351fb6f4807f'
AND EXISTS (SELECT 1 FROM updated_users)
AND EXISTS (SELECT 1 FROM updated_items)
RETURNING *;


DELETE FROM transactions WHERE id = $1;


SELECT 
    user_id,
    item_id,
    quantity,
    total,
    status,
    created_at,
    (
        SELECT json_agg(json_build_object(
            'id', users.id,
            'name', users.name,
            'email', users.email,
            'password', users.password,
            'balance', users.balance,
            'created_at', users.created_at
        ))
        FROM users
        WHERE
            users.id = transactions.user_id
    ) as user,
    (
        SELECT json_agg(json_build_object(
            'id', items.id,
            'name', items.name,
            'price', items.price,
            'store_id', items.store_id,
            'image_url', items.image_url,
            'stock', items.stock,
            'created_at', items.created_at
        ))
        FROM items
        WHERE 
            items.id = transactions.item_id
    ) as item
FROM transactions;