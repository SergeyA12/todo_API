const express = require("express");
const body_parser = require("body-parser");
const { Pool } = require("pg");
const PORT = 3013;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "newusers",
  password: "sql12",
  port: 5432,
});

const app = express();
app.use(body_parser.json());

app.post("/", async (req, res) => {
  const { title, startdate, enddate } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO todo_items (title, startdate, enddate) VALUES ($1, $2, $3) RETURNING *",
      [title, startdate, enddate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM todo_items WHERE id = $1", [
      id,
    ]);
    if (!result.rows.length) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todo_items");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Items not found" });
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, startdate, enddate } = req.body;
  try {
    const result = await pool.query(
      "UPDATE todo_items SET title = $1, startdate = $2, enddate = $3 WHERE id = $4 RETURNING *",
      [title, startdate, enddate, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM todo_items WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`server is running localhost:${PORT}`);
});
