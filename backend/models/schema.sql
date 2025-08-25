-- Affiliates Table
CREATE TABLE IF NOT EXISTS affiliates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO affiliates (name) VALUES
('test 1'),
('test 2')
ON CONFLICT DO NOTHING;


-- Campaigns Table
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

INSERT INTO campaigns (name) VALUES
('Campaign 1'),
('Campaign 2')
ON CONFLICT DO NOTHING;


-- Clicks Table
CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    affiliate_id INT REFERENCES affiliates(id) ON DELETE CASCADE,
    campaign_id INT REFERENCES campaigns(id) ON DELETE CASCADE,
    click_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);


-- Conversions Table
CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    click_id VARCHAR(255) REFERENCES clicks(click_id) ON DELETE CASCADE,
    amount FLOAT,
    currency TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);


-- Reset Sequences to Avoid Duplicate Key Errors
SELECT setval(pg_get_serial_sequence('affiliates', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM affiliates;
SELECT setval(pg_get_serial_sequence('campaigns', 'id'), COALESCE(MAX(id), 0) + 1, false) FROM campaigns;
