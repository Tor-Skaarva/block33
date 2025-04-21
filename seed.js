const pg = require("pg");
const client = new pg.Client("postgres://Torsk:wordpass@localhost:5432/HR");

const empl = async () => {
  try {
    await client.connect();
    const SQL = `
    DROP TABLE IF EXISTS departments CASCADE;
        CREATE TABLE departments(
            id SERIAL PRIMARY KEY,
            department VARCHAR(100)
        );
        INSERT INTO departments(department) VALUES('HR');
        INSERT INTO departments(department) VALUES('R&D');
        INSERT INTO departments(department) VALUES('Legal');
        DROP TABLE IF EXISTS employees;
        CREATE TABLE employees(
            id SERIAL PRIMARY KEY,
            name VARCHAR(100),
            department_id SERIAL REFERENCES departments(id) NOT NULL
        );
        INSERT INTO employees(name, department_id) VALUES ('Ryan', (SELECT id from departments where department ='Legal'));
        INSERT INTO employees(name, department_id) VALUES ('Nikhil', (SELECT id from departments where department ='R&D'));
        INSERT INTO employees(name, department_id) VALUES ('Alyssa', (SELECT id from departments where department ='Legal'));
        INSERT INTO employees(name, department_id) VALUES ('Sonia', (SELECT id from departments where department ='R&D'));
        INSERT INTO employees(name, department_id) VALUES ('Chloe', (SELECT id from departments where department ='HR'));
        INSERT INTO employees(name, department_id) VALUES ('Nugi', (SELECT id from departments where department ='HR'));
`;
    await client.query(SQL);
    console.log("Seeded");
    await client.end();
  } catch (error) {
    console.error(error);
  }
};
empl();
