const express = require('express');
const db = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Fetch all NFTs
app.get('/nfts', (req, res) => {
    db.all('SELECT * FROM nfts', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Add a new NFT
app.post('/nfts', (req, res) => {
    const { title, description, category, creator_id } = req.body;
    const query = `INSERT INTO nfts (title, description, category, creator_id) VALUES (?, ?, ?, ?)`;
    db.run(query, [title, description, category, creator_id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID });
        }
    });
});

// Fetch transaction data
app.get('/transactions', (req, res) => {
    const query = `
        SELECT 
            t.id, t.nft_id, t.buyer_id, t.seller_id, t.transaction_type, 
            t.price, t.transaction_status, t.created_at, n.category
        FROM transactions t
        LEFT JOIN nfts n ON t.nft_id = n.id;
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Total Sales
app.get('/analytics/total-sales', (req, res) => {
    const query = `SELECT SUM(price) AS total_sales FROM transactions WHERE transaction_status = 'completed'`;
    db.get(query, [], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ totalSales: row.total_sales || 0 });
        }
    });
});

// Transactions by Category
app.get('/analytics/transactions-by-category', (req, res) => {
    const query = `
        SELECT n.category, COUNT(t.id) AS transaction_count
        FROM transactions t
        LEFT JOIN nfts n ON t.nft_id = n.id
        WHERE t.transaction_status = 'completed'
        GROUP BY n.category;
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Recent Transactions
app.get('/analytics/recent-transactions', (req, res) => {
    const query = `
        SELECT 
            t.id, t.nft_id, t.buyer_id, t.seller_id, t.transaction_type, 
            t.price, t.transaction_status, t.created_at, n.category
        FROM transactions t
        LEFT JOIN nfts n ON t.nft_id = n.id
        ORDER BY t.created_at DESC
        LIMIT 5;
    `;
    db.all(query, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
