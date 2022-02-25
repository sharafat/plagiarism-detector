CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT,
    password TEXT,
    CONSTRAINT uq_users_email UNIQUE (email)
);

REPLACE INTO users (email, password) VALUES ('demo@demo.com', 'demo');
