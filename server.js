const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'projectdb',
    password: 'Eggface_1431',
    port: 5432,
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

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});