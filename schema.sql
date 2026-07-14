-- ============================================
-- Reply Tool — PostgreSQL Schema
-- Author: S M Abdul Samad Shahid
-- ============================================

CREATE TABLE customers (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(150) UNIQUE NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tickets (
    id           SERIAL PRIMARY KEY,
    customer_id  INT REFERENCES customers(id) ON DELETE CASCADE,
    subject      VARCHAR(255) NOT NULL,
    message      TEXT NOT NULL,
    status       VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved')),
    priority     VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    created_at   TIMESTAMP DEFAULT NOW(),
    updated_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE replies (
    id          SERIAL PRIMARY KEY,
    ticket_id   INT REFERENCES tickets(id) ON DELETE CASCADE,
    agent_name  VARCHAR(100) NOT NULL,
    message     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE agents (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(150) UNIQUE NOT NULL,
    role       VARCHAR(20) DEFAULT 'support' CHECK (role IN ('support', 'admin')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ── Indexes for performance ──────────────────
CREATE INDEX idx_tickets_status     ON tickets(status);
CREATE INDEX idx_tickets_customer   ON tickets(customer_id);
CREATE INDEX idx_replies_ticket     ON replies(ticket_id);

-- ── Seed Data ────────────────────────────────
INSERT INTO customers (name, email) VALUES
    ('Ali Hassan',    'ali@example.com'),
    ('Sara Ahmed',    'sara@example.com'),
    ('John Smith',    'john@example.com');

INSERT INTO agents (name, email, role) VALUES
    ('Samad Shahid',  'syedsamad889@gmail.com', 'support'),
    ('Admin User',    'admin@stickermule.com',  'admin');

INSERT INTO tickets (customer_id, subject, message, status, priority) VALUES
    (1, 'Order not received',    'My order #1023 has not arrived yet.',       'open',     'high'),
    (2, 'Wrong item delivered',  'I received the wrong sticker size.',         'pending',  'normal'),
    (3, 'Refund request',        'I would like a refund for order #2045.',     'open',     'high');

INSERT INTO replies (ticket_id, agent_name, message) VALUES
    (1, 'Samad Shahid', 'Hi Ali, we are looking into your order right away. We will update you within 24 hours.'),
    (2, 'Samad Shahid', 'Hi Sara, we apologize for the inconvenience. A replacement has been dispatched.');

-- ── Useful Queries ───────────────────────────

-- All open high-priority tickets
SELECT t.id, c.name, t.subject, t.priority, t.created_at
FROM tickets t
JOIN customers c ON t.customer_id = c.id
WHERE t.status = 'open' AND t.priority = 'high'
ORDER BY t.created_at ASC;

-- Ticket count by status
SELECT status, COUNT(*) AS total
FROM tickets
GROUP BY status;

-- Full ticket thread with replies
SELECT t.subject, t.message AS customer_msg,
       r.agent_name, r.message AS reply, r.created_at
FROM tickets t
LEFT JOIN replies r ON r.ticket_id = t.id
WHERE t.id = 1;
