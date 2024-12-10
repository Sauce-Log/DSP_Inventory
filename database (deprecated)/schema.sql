-- schema.sql

-- Drop tables if they exist to reset the schema
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS images;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS locations;

-- Inventory Table
CREATE TABLE inventory (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    building VARCHAR(255) NOT NULL,
    room VARCHAR(255) NOT NULL,
    -- condition VARCHAR(100) NOT NULL,
    -- quantity INTEGER NOT NULL,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Image Table
CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES inventory(item_id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requests Table
CREATE TABLE requests (
    request_id SERIAL PRIMARY KEY,
    item_id INTEGER REFERENCES inventory(item_id) ON DELETE SET NULL,
    requester VARCHAR(255) NOT NULL,
    request_type VARCHAR(100) NOT NULL,
    status VARCHAR(100) DEFAULT 'Pending',
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fulfilled_at TIMESTAMP
);
