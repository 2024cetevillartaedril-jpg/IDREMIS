const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname));

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'admin123',
    database: 'IDREMIS',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection()
    .then(connection => {
        console.log('Connected to IDREMIS MySQL Database successfully.');
        connection.release();
    })
    .catch(error => {
        console.error('Database connection error:', error.message);
    });

app.get('/api/requests', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                request_id,
                first_name,
                middle_initial,
                last_name,
                phone_number,
                location,
                emergency_type,
                selected_tags,
                additional_details,
                created_at
            FROM emergency_requests
            ORDER BY request_id DESC
        `);

        res.json({
            success: true,
            data: rows
        });

    } catch (error) {
        console.error('Error fetching requests:', error);

        res.status(500).json({
            success: false,
            error: 'Database query failed'
        });
    }
});

app.post('/api/requests', async (req, res) => {
    const {
        first_name,
        middle_initial,
        last_name,
        phone_number,
        location,
        emergency_type,
        selected_tags,
        additional_details
    } = req.body;

    if (
        !first_name ||
        !last_name ||
        !phone_number ||
        !location ||
        !emergency_type
    ) {
        return res.status(400).json({
            success: false,
            error: 'First name, last name, phone number, location, and emergency type are required.'
        });
    }

    try {
        const query = `
            INSERT INTO emergency_requests
            (
                first_name,
                middle_initial,
                last_name,
                phone_number,
                location,
                emergency_type,
                selected_tags,
                additional_details
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            first_name,
            middle_initial || '',
            last_name,
            phone_number,
            location,
            emergency_type,
            selected_tags || '',
            additional_details || ''
        ];

        const [result] = await db.execute(query, values);

        res.status(201).json({
            success: true,
            message: 'Emergency request logged successfully.',
            id: result.insertId
        });

    } catch (error) {
        console.error('Error creating request:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to insert request into database'
        });
    }
});

app.put('/api/requests/:id', async (req, res) => {
    const requestId = req.params.id;

    const {
        first_name,
        middle_initial,
        last_name,
        phone_number,
        location,
        emergency_type,
        selected_tags,
        additional_details
    } = req.body;

    if (
        !requestId ||
        requestId === 'undefined' ||
        requestId === 'null'
    ) {
        return res.status(400).json({
            success: false,
            error: 'Invalid ID provided.'
        });
    }

    try {
        const query = `
            UPDATE emergency_requests
            SET
                first_name = ?,
                middle_initial = ?,
                last_name = ?,
                phone_number = ?,
                location = ?,
                emergency_type = ?,
                selected_tags = ?,
                additional_details = ?
            WHERE request_id = ?
        `;

        const values = [
            first_name,
            middle_initial || '',
            last_name,
            phone_number,
            location,
            emergency_type || 'General',
            selected_tags || '',
            additional_details || '',
            requestId
        ];

        const [result] = await db.execute(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Request record not found'
            });
        }

        res.json({
            success: true,
            message: 'Request updated successfully'
        });

    } catch (error) {
        console.error('Error updating request:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to update request'
        });
    }
});

app.delete('/api/requests/:id', async (req, res) => {
    const requestId = req.params.id;

    if (
        !requestId ||
        requestId === 'undefined' ||
        requestId === 'null'
    ) {
        return res.status(400).json({
            success: false,
            error: 'Invalid or missing Request ID'
        });
    }

    try {
        const [result] = await db.execute(
            'DELETE FROM emergency_requests WHERE request_id = ?',
            [requestId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Record not found in database'
            });
        }

        res.json({
            success: true,
            message: `Request #${requestId} deleted successfully`
        });

    } catch (error) {
        console.error('Error deleting request:', error);

        res.status(500).json({
            success: false,
            error: 'Failed to delete record from database'
        });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            success: false,
            error: 'API route not found'
        });
    }

    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});