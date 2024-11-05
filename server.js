const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');


app.use(cors({
    origin: 'https://taskmanager-5si3.onrender.com'
  }));
app.use(express.json());

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Include if connecting securely to an external host
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM mediadata ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Server Error');
    }
});

app.put('/data/:inorde/:id', async (req, res) => {
    const { inorde, id } = req.params;
    let query;

    try {
        if (inorde === '+') {
            query = 'UPDATE mediadata SET watched = watched + 1 WHERE id = $1';
        } else if (inorde === '-') {
            query = 'UPDATE mediadata SET watched = watched - 1 WHERE id = $1';
        } else {
            return res.status(400).send('Invalid action');
        }

        const result = await pool.query(query, [id]);

        if (result.rowCount === 0) {
            return res.status(404).send('Record not found');
        }

        res.send('Record updated successfully');
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).send('Server error');
    }
});

app.put('/data', async (req, res) => {
    const { episodes, title } = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO mediadata VALUES ($1, $2, 0, 'images/dodypoper.jpg') RETURNING *",
            [title, episodes]
        );

        if (result.rows.length > 0) {
            res.status(201).json(result.rows[0]);
        } else {
            res.status(500).json({ error: 'No data was inserted' });
        }
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Server error' });
    }
});


app.delete('/data/delete', async (req, res) => { 
    const { id } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ error: 'ID is required' });
        }

        const result = await pool.query("DELETE FROM mediadata WHERE id = $1", [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Record not found' });
        }
        
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        console.error('Error executing query', error.stack);
        res.status(500).json({ error: 'Server error' });
    }
});



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
