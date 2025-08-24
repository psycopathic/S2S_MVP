-- Affiliates
CREATE TABLE IF NOT EXISTS affiliates (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO affiliates (id, name) VALUES
(1, 'Affiliate 1'),
(2, 'Affiliate 2')
ON CONFLICT DO NOTHING;

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL
);

INSERT INTO campaigns (id, name) VALUES
(1, 'Campaign 1'),
(2, 'Campaign 2')
ON CONFLICT DO NOTHING;

-- Clicks
CREATE TABLE IF NOT EXISTS clicks (
    id SERIAL PRIMARY KEY,
    affiliate_id INT REFERENCES affiliates(id),
    campaign_id INT REFERENCES campaigns(id),
    click_id VARCHAR(255) UNIQUE NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Conversions
CREATE TABLE IF NOT EXISTS conversions (
    id SERIAL PRIMARY KEY,
    click_id VARCHAR(255) REFERENCES clicks(click_id),
    amount FLOAT,
    currency TEXT,
    timestamp TIMESTAMP DEFAULT NOW()
);
