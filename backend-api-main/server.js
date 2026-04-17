const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`Request received: ${req.method} ${req.url}`);
    next();
});

// Database Setup & AUTO-CLEANUP
const db = new sqlite3.Database('./projects.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // 1. Ensure Table Exists
        db.run(`CREATE TABLE IF NOT EXISTS projects (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            status TEXT,
            assignee TEXT,
            priority TEXT,
            created_at TEXT,
            last_updated TEXT
        )`, (err) => {
            if (err) {
                console.error("Table creation failed:", err.message);
            } else {
                // 2. RUN AUTO-CLEANUP: Delete any nameless projects immediately
                db.run("DELETE FROM projects WHERE name IS NULL OR TRIM(name) = ''", function(err) {
                    if (!err && this.changes > 0) {
                        console.log(`⚠️  Cleaned up ${this.changes} nameless project(s) from the database.`);
                    } else {
                        console.log("Database is clean (no nameless projects found).");
                    }
                });
            }
        });
    }
});

app.get('/', (req, res) => res.send('Backend API is running...'));

// Helper: Check if string is invalid
const isInvalid = (str) => !str || str.trim() === "";

// --- API ENDPOINTS ---

// 1. GET ALL
app.get('/api/projects', (req, res) => {
    db.all("SELECT * FROM projects", [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: rows });
    });
});

// 2. GET ONE
app.get('/api/projects/:id', (req, res) => {
    db.get("SELECT * FROM projects WHERE id = ?", [req.params.id], (err, row) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "success", data: row });
    });
});

// 3. POST (Create)
app.post('/api/projects', (req, res) => {
    const { name, description, status, assignee, priority } = req.body;
    
    // VALIDATION: Reject nameless projects
    if (isInvalid(name)) {
        return res.status(400).json({ error: "Validation Error: Project name is required." });
    }
    
    // VALIDATION: Priority
    if (priority) {
        const validPriorities = ['Low', 'Medium', 'High'];
        if (!validPriorities.includes(priority)) {
            return res.status(400).json({ error: "Validation Error: Invalid Priority." });
        }
    }

    const now = new Date().toISOString(); 
    const sql = `INSERT INTO projects (name, description, status, assignee, priority, created_at, last_updated) 
                 VALUES (?,?,?,?,?,?,?)`;
    
    const params = [
        name, 
        description || "", 
        status || 'Active', 
        assignee || 'Unassigned', 
        priority || 'Medium', 
        now, now
    ];
    
    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ 
            message: "success", 
            data: { id: this.lastID, name, description, status, assignee, priority, created_at: now, last_updated: now } 
        });
    });
});

// 4. PUT (Full Replace)
app.put('/api/projects/:id', (req, res) => {
    const { name, description, status, assignee, priority } = req.body;
    const now = new Date().toISOString();

    // STRICT VALIDATION
    if (isInvalid(name)) {
        return res.status(400).json({ error: "Validation Error: Project name cannot be empty." });
    }

    const sql = `UPDATE projects SET name=?, description=?, status=?, assignee=?, priority=?, last_updated=? WHERE id=?`;

    const params = [
        name, 
        description || "", 
        status || 'Active', 
        assignee || 'Unassigned', 
        priority || 'Medium', 
        now, 
        req.params.id
    ];

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ message: "success", changes: this.changes });
    });
});

// 5. PATCH (Partial Update)
app.patch('/api/projects/:id', (req, res) => {
    const { name, description, status, assignee, priority } = req.body;
    const now = new Date().toISOString();
    
    // Prevent emptying the name
    if (name !== undefined && isInvalid(name)) {
        return res.status(400).json({ error: "Validation Error: Project name cannot be empty." });
    }

    const sql = `UPDATE projects SET 
                 name = COALESCE(?, name), 
                 description = COALESCE(?, description), 
                 status = COALESCE(?, status),
                 assignee = COALESCE(?, assignee),
                 priority = COALESCE(?, priority),
                 last_updated = ? 
                 WHERE id = ?`;
                 
    const params = [name, description, status, assignee, priority, now, req.params.id];

    db.run(sql, params, function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ message: "success", changes: this.changes });
    });
});

// 6. DELETE
app.delete('/api/projects/:id', (req, res) => {
    db.run('DELETE FROM projects WHERE id = ?', [req.params.id], function (err) {
        if (err) return res.status(400).json({ "error": err.message });
        res.json({ message: "deleted", changes: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});