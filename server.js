const express = require("express");
const app = express();
const PORT = 3000;
const pg = require("pg");
const client = new pg.Client("postgres://Torsk:wordpass@localhost/HR");
const cors = require("cors");
app.use(cors());
app.use(express.json());
app.use(require("morgan")("dev"));

//test get
app.listen(PORT, () => {
  console.log(`I am listening to PORT ${PORT}`);
});
app.get("/", (req, res, next) => {
  res.status(200).json({ message: "This works" });
});

//employees get
app.get("/api/employees", async (req, res) => {
  try {
    const SQL = `
        SELECT * FROM employees;
        `;
    const response = await client.query(SQL);
    res.status(200).send(response.rows);
  } catch (error) {
    res.status(400).send("You've broken me");
  }
});

//department get
app.get("/api/departments", async (req, res) => {
  try {
    const SQL = `
        SELECT * FROM departments;
        `;
    const response = await client.query(SQL);
    res.status(200).send(response.rows);
  } catch (error) {
    res.status(400).send("You've broken me");
  }
});

//employees post, body (name, department_id)
app.post("/api/employees", async (req, res) => {
  try {
    const { name, department_id } = req.body;
    const SQL = `
    INSERT INTO employees(name, department_id) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [name, department_id]);
    res.status(201).send(response.rows);
  } catch (error) {
    res.status(400).send("You've broken me");
  }
});

//employee delete, params (id)
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const SQL = `
          DELETE FROM employees WHERE id = $1
      `;
    const response = await client.query(SQL, [id]);
    res.sendStatus(204);
  } catch (error) {
    res.status(400).send("You've broken me");
  }
});

//employee put, params name and department id
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, department_id } = req.body;
    const SQL = `
            UPDATE employees
            SET name = $1,
            department_id = $2
            WHERE id = $3
            RETURNING *
        `;
    const response = await client.query(SQL, [name, department_id, id]);
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//init create
const init = async (req, res) => {
  try {
    await client.connect();
  } catch (error) {
    console.error(error);
  }
};

//init gov'na'
init();
