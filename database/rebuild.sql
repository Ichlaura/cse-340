-- rebuild.sql

-- Step 1: Create enum type
DROP TYPE IF EXISTS account_type_enum CASCADE;
CREATE TYPE account_type_enum AS ENUM ('Client', 'Admin');

-- Step 2: Create tables
DROP TABLE IF EXISTS inventory, classification, account CASCADE;

CREATE TABLE account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) UNIQUE NOT NULL,
    account_password VARCHAR(100) NOT NULL,
    account_type account_type_enum DEFAULT 'Client'
);

CREATE TABLE classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INT NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255),
    inv_thumbnail VARCHAR(255),
    inv_price NUMERIC(10,2) NOT NULL,
    inv_miles INT NOT NULL,
    inv_color VARCHAR(20) NOT NULL,
    classification_id INT NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);

-- Step 3: Insert seed data
INSERT INTO classification (classification_name) VALUES
('SUV'), ('Truck'), ('Sedan'), ('Sport');

INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
VALUES 
('Ford', 'Explorer', 2021, 'A spacious SUV with excellent features', '/images/explorer.jpg', '/images/explorer-thumb.jpg', 35000.00, 10000, 'Black', 1),
('GM', 'Hummer', 2022, 'A rugged SUV with small interiors', '/images/hummer.jpg', '/images/hummer-thumb.jpg', 45000.00, 5000, 'Gray', 1),
('Toyota', 'Camry', 2020, 'A reliable sedan for everyday use', '/images/camry.jpg', '/images/camry-thumb.jpg', 25000.00, 15000, 'White', 3),
('Mazda', 'Miata', 2021, 'A sporty convertible with style', '/images/miata.jpg', '/images/miata-thumb.jpg', 27000.00, 8000, 'Red', 4);

-- Step 4: Run queries 4 and 6
-- Task #4
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM'
	AND inv_model = 'Hummer';

-- Task #6
UPDATE inventory
SET 
    inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
