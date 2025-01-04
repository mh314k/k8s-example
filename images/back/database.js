require('dotenv').config();



const mysql = require("mysql2");

// Configuration variables
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = process.env.DB_PORT || 3306;
const DB_USER = process.env.DB_USER || "usr";
const DB_PASSWORD = process.env.DB_PASSWORD || "pass";
const DB_NAME = process.env.DB_NAME || "db";

// Initialize MySQL connection
const connection = mysql.createConnection({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  connectTimeout: 10000,
  keepAliveInitialDelay: 10000,
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  } else {
    console.log("Connected to MySQL server.");

    // Create the database if it doesn't exist
    connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
      if (err) {
        console.error("Error creating database:", err);
        process.exit(1);
      } else {
        console.log(`Database '${DB_NAME}' ensured.`);

        // Switch to the database
        connection.changeUser({ database: DB_NAME }, (err) => {
          if (err) {
            console.error("Error selecting database:", err);
            process.exit(1);
          } else {
            console.log(`Using database '${DB_NAME}'.`);

            // Create the table if it doesn't exist
            const createTableQuery = `
              CREATE TABLE IF NOT EXISTS numbers (
                id INT PRIMARY KEY AUTO_INCREMENT,
                value INT NOT NULL
              )
            `;
            connection.query(createTableQuery, (err) => {
              if (err) {
                console.error("Error creating table:", err);
                process.exit(1);
              } else {
                console.log("Table 'numbers' ensured.");
                // Insert initial value if table is empty
                const checkTableQuery = "SELECT COUNT(*) AS count FROM numbers";
                connection.query(checkTableQuery, (err, results) => {
                  if (err) {
                    console.error("Error checking table:", err);
                  } else if (results[0].count === 0) {
                    const insertQuery = "INSERT INTO numbers (value) VALUES (0)";
                    connection.query(insertQuery, (err) => {
                      if (err) {
                        console.error("Error inserting initial value:", err);
                      } else {
                        console.log("Inserted initial value into 'numbers'.");
                      }
                    });
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});

// Get the current number from the database
function getCurrentNumber() {
  return new Promise((resolve, reject) => {
    const query = "SELECT value FROM numbers LIMIT 1";
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0] ? results[0].value : 0);
      }
    });
  });
}

// Update the number in the database
function updateNumber(newValue) {
  return new Promise((resolve, reject) => {
    const query = "UPDATE numbers SET value = ? WHERE id = 1";
    connection.query(query, [newValue], (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { getCurrentNumber, updateNumber };
