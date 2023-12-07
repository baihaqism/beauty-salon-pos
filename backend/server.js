const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQLPORT,
});

const secretKey = process.env.SECRET_KEY;

db.connect((err) => {
  if (err) {
    console.error("MySQL connection error:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.post("/register", (req, res) => {
  const { firstname, lastname, username, password, confirmPassword, role } =
    req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const sqlCheckExisting =
    "SELECT * FROM users WHERE (firstname = ? AND lastname = ?) OR username = ?";
  db.query(
    sqlCheckExisting,
    [firstname, lastname, username],
    (err, results) => {
      if (err) {
        console.error("Error checking for existing user:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      } else if (results.length > 0) {
        return res.status(400).json({
          error: "A user with similar data already exists",
        });
      } else {
        const sqlCheckUsername = "SELECT * FROM users WHERE username = ?";
        db.query(sqlCheckUsername, [username], (err, usernameResults) => {
          if (err) {
            console.error("Error checking for existing username:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          } else if (usernameResults.length > 0) {
            return res.status(400).json({
              error: "Username already exists",
            });
          } else {
            const userRole = role || "Cashier";
            const sql =
              "INSERT INTO users (firstname, lastname, username, password, role) VALUES (?, ?, ?, ?, ?)";
            db.query(
              sql,
              [firstname, lastname, username, password, userRole],
              (err, result) => {
                if (err) {
                  console.error("MySQL query error:", err);
                  return res
                    .status(500)
                    .json({ message: "Internal server error" });
                } else {
                  console.log("User registered:", result);
                  return res
                    .status(200)
                    .json({ message: "Registration successful" });
                }
              }
            );
          }
        });
      }
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query =
    "SELECT * FROM users WHERE BINARY username = ? AND BINARY password = ?";

  db.query(query, [username, password], (err, result) => {
    if (err) {
      console.error("MySQL query error:", err);
      res.status(500).json({ message: "Internal server error" });
    } else {
      if (result.length > 0) {
        const user = {
          username: result[0].username,
          firstname: result[0].firstname,
          lastname: result[0].lastname,
          role: result[0].role,
        };
        const token = jwt.sign(user, secretKey, { expiresIn: "1000h" });

        res
          .status(200)
          .json({ message: "Login successful", token, role: user.role });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    }
  });
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Failed to authenticate token" });
    }

    req.user = decoded;

    next();
  });
};

app.use(authenticateToken);

const allowRoles = (allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role) {
      return res.status(403).json({ message: "Access denied" });
    }

    const role = user.role;
    if (allowedRoles.includes(role)) {
      next();
    } else {
      return res.status(403).json({ message: "Access denied" });
    }
  };
};

app.get("/protected-route", allowRoles(["Cashier"]), (req, res) => {
  const userId = req.user.id;

  res.json({ message: "Access granted to protected route", userId });
});

app.get("/transactions", (req, res) => {
  const sql = `
    SELECT
      t.id_transactions,
      t.name AS transaction_name,
      t.name_service AS transaction_name_service,
      t.price_service,
      t.quantity,
      t.issued_transactions,
      t.total_transactions,
      t.isDeleted,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,
      s.id_service,
      u.firstname AS user_firstname,
      u.lastname AS user_lastname
    FROM transactions t
    LEFT JOIN customers c ON t.id_customers = c.id_customers
    LEFT JOIN services s ON t.name_service = s.name_service
    LEFT JOIN users u ON t.id_users = u.id_users
    WHERE t.isDeleted = 0;
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res
        .status(500)
        .json({ error: "Internal Server Error", details: err.message });
    } else {
      const transactions = results.map((row) => ({
        id_transactions: row.id_transactions,
        transaction_name: row.transaction_name,
        transaction_name_service: row.transaction_name_service,
        price_service: row.price_service,
        quantity: row.quantity,
        issued_transactions: row.issued_transactions,
        total_transactions: row.total_transactions,
        isDeleted: row.isDeleted,
        customer_name: row.customer_name,
        customer_email: row.customer_email,
        customer_phone: row.customer_phone,
        id_service: row.id_service,
        user_firstname: row.user_firstname,
        user_lastname: row.user_lastname,
      }));
      // console.log("Fetched data:", transactions);
      res.json(transactions);
    }
  });
});

app.post("/add-transaction", (req, res) => {
  const {
    name,
    name_service,
    price_service,
    quantity,
    total_transactions,
    issued_transactions,
    id_customers,
    id_users,
  } = req.body;

  if (
    name &&
    total_transactions &&
    issued_transactions &&
    id_customers &&
    name_service &&
    quantity
  ) {
    const nameServiceValue = Array.isArray(name_service)
      ? name_service.join("\n")
      : name_service;
    const priceServiceValue = Array.isArray(price_service)
      ? price_service.join("\n")
      : price_service;
    const quantityValue = Array.isArray(quantity) ? quantity : [quantity];

    if (quantityValue.some((qty) => qty <= 0)) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }

    db.beginTransaction((err) => {
      if (err) {
        console.error("Error starting transaction:", err);
        return res
          .status(500)
          .json({ error: "Internal Server Error", details: err.message });
      }

      const checkServiceAvailabilityQuery = `
        SELECT
          s.id_service,
          s.name_service,
          s.price_service,
          s.isDeleted,
          GROUP_CONCAT(ps.product_id) AS product_id,
          CASE
            WHEN SUM(CASE WHEN p.quantity_product = 0 THEN 1 ELSE 0 END) > 0 THEN 'Unavailable'
            ELSE 'Available'
          END AS availability
        FROM
          services s
        LEFT JOIN
          serviceproducts ps ON s.id_service = ps.service_id
        LEFT JOIN
          products p ON ps.product_id = p.id_product
        WHERE
          s.name_service = ?
        GROUP BY
          s.id_service, s.name_service, s.price_service
      `;

      Promise.all(
        name_service.map((serviceName, index) => {
          return new Promise((resolve, reject) => {
            db.query(
              checkServiceAvailabilityQuery,
              [serviceName],
              (err, availabilityResult) => {
                if (err) {
                  reject(err);
                } else {
                  const availability = availabilityResult[0].availability;
                  if (availability === "Unavailable") {
                    reject(
                      new Error(
                        `Service is unavailable: ${serviceName}`
                      )
                    );
                  } else {
                    resolve();
                  }
                }
              }
            );
          });
        })
      )
        .then(() => {
          const transactionInsertQuery = `
            INSERT INTO transactions (name, name_service, price_service, quantity, total_transactions, issued_transactions, id_customers, id_users)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;
          db.query(
            transactionInsertQuery,
            [
              name,
              nameServiceValue,
              priceServiceValue,
              quantityValue.join("\n"),
              total_transactions,
              issued_transactions,
              id_customers,
              id_users,
            ],
            (err, result) => {
              if (err) {
                console.error("Error adding transaction:", err);
                return db.rollback(() => {
                  res.status(500).json({
                    error: "Internal Server Error",
                    details: err.message,
                  });
                });
              }

              for (let i = 0; i < name_service.length; i++) {
                const serviceName = name_service[i];
                const serviceQuantity = quantity[i];

                const productUpdateQuery = `
                  UPDATE Products
                  SET quantity_product = CASE
                    WHEN quantity_product - ? < -1 THEN -1  -- Set it to -1 to avoid going below -1
                    ELSE quantity_product - ?
                    END
                  WHERE id_product IN (
                    SELECT product_id FROM ServiceProducts WHERE service_id = (
                      SELECT id_service FROM services WHERE name_service = ?
                    )
                  )
                `;
                db.query(
                  productUpdateQuery,
                  [serviceQuantity, serviceQuantity, serviceName],
                  (err, updateResult) => {
                    if (err) {
                      console.error("Error updating product quantity:", err);
                      return db.rollback(() => {
                        res.status(500).json({
                          error: "Internal Server Error",
                          details: err.message,
                        });
                      });
                    }
                  }
                );
              }

              db.commit((err) => {
                if (err) {
                  console.error("Error committing transaction:", err);
                  return db.rollback(() => {
                    res.status(500).json({
                      error: "Internal Server Error",
                      details: err.message,
                    });
                  });
                }
                res
                  .status(200)
                  .json({ message: "Transaction added successfully" });
              });
            }
          );
        })
        .catch((err) => {
          if (err.message.startsWith('Service is unavailable:')) {
            return res.status(400).json({ error: err.message });
          } else {
            console.error('Error checking service availability:', err);
            return db.rollback(() => {
              res.status(500).json({ error: 'Internal Server Error', details: err.message });
            });
          }
        });
    });
  } else {
    res.status(400).json({ error: "Missing required fields" });
  }
});

app.get("/transactions/details/:id", (req, res) => {
  const id = parseInt(req.params.id);

  db.query(
    "SELECT t.id_transactions, t.name, t.name_service, t.price_service, t.quantity, t.issued_transactions, t.total_transactions, t.id_customers, t.id_users, " +
      "c.name AS customer_name, c.email AS customer_email, c.phone AS customer_phone, " +
      "s.name_service AS service_name, " +
      "u.firstname AS user_firstname, u.lastname AS user_lastname " +
      "FROM transactions t " +
      "JOIN customers c ON t.id_customers = c.id_customers " +
      "LEFT JOIN services s ON t.name_service = s.name_service " +
      "LEFT JOIN users u ON t.id_users = u.id_users " +
      "WHERE t.id_transactions = ?",
    [id],
    (queryError, results) => {
      if (queryError) {
        console.error("Error fetching transaction details:", queryError);
        res.status(500).json({
          error: "Internal server error",
          details: queryError.message,
        });
      } else if (results.length > 0) {
        res.json(results[0]);
      } else {
        console.error("Transaction not found for id: ", id);
        res.status(404).json({ error: "Transaction not found" });
      }
    }
  );
});

app.put("/edit-transaction/:id", allowRoles(["Admin"]), (req, res) => {
  const id = parseInt(req.params.id);
  const {
    name,
    name_service,
    price_service,
    quantity,
    total_transactions,
    issued_transactions,
    id_customers,
    id_users,
  } = req.body;

  if (
    name &&
    total_transactions &&
    issued_transactions &&
    id_customers &&
    name_service
  ) {
    const nameServiceValue = Array.isArray(name_service)
      ? name_service.join("\n")
      : name_service;
    const priceServiceValue = Array.isArray(price_service)
      ? price_service.join("\n")
      : price_service;
    const quantityValue = Array.isArray(quantity)
      ? quantity.join("\n")
      : quantity;

    const sql = `
      UPDATE transactions 
      SET 
        name = ?,
        name_service = ?,
        price_service = ?,
        quantity = ?,
        total_transactions = ?,
        issued_transactions = ?,
        id_customers = ?,
        id_users = ?
      WHERE id_transactions = ?
    `;

    db.query(
      sql,
      [
        name,
        nameServiceValue,
        priceServiceValue,
        quantityValue,
        total_transactions,
        issued_transactions,
        id_customers,
        id_users,
        id,
      ],
      (err, result) => {
        if (err) {
          console.error("Error editing transaction:", err);
          res
            .status(500)
            .json({ error: "Internal Server Error", details: err.message });
        } else if (result.affectedRows > 0) {
          res.status(200).json({ message: "Transaction updated successfully" });
        } else {
          res.status(404).json({ error: "Transaction not found" });
        }
      }
    );
  } else {
    res.status(400).json({ error: "Missing required fields" });
  }
});

app.put("/delete-transaction/:id", allowRoles(["Admin"]), (req, res) => {
  const { id } = req.params;

  const sql =
    "UPDATE transactions SET isDeleted = true WHERE id_transactions = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting transaction:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.affectedRows > 0) {
        res
          .status(200)
          .json({ message: "Transaction soft deleted successfully" });
      } else {
        res.status(404).json({ error: "Transaction not found" });
      }
    }
  });
});

app.get("/customers", (req, res) => {
  const sql =
    "SELECT id_customers, name, email, phone, isDeleted FROM customers WHERE isDeleted = 0";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/add-customer", (req, res) => {
  const { name, email, phone } = req.body;

  const checkExistingCustomerSql =
    "SELECT * FROM customers WHERE name = ? OR email = ? OR phone = ?";
  db.query(checkExistingCustomerSql, [name, email, phone], (err, result) => {
    if (err) {
      console.error("Error checking existing customer:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result && result.length > 0) {
        res.status(400).json({
          error: "Customer with the same name, email, or phone already exists",
        });
      } else {
        const insertCustomerSql =
          "INSERT INTO customers (name, email, phone) VALUES (?, ?, ?)";
        db.query(insertCustomerSql, [name, email, phone], (err, result) => {
          if (err) {
            console.error("Error adding customer:", err);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.status(200).json({ message: "Customer added successfully" });
          }
        });
      }
    }
  });
});

app.put("/update-customer/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, phone } = req.body;

  const checkExistingQuery =
    "SELECT * FROM customers WHERE (name =? OR email = ? OR phone = ?) AND id_customers != ?";
  db.query(
    checkExistingQuery,
    [name, email, phone, id],
    (checkErr, checkResult) => {
      if (checkErr) {
        console.error("Error checking existing customer:", checkErr);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (checkResult.length > 0) {
        res.status(400).json({
          error: "Name or email or phone number already exists in the database",
        });
      } else {
        const updateQuery =
          "UPDATE customers SET name = ?, email = ?, phone = ? WHERE id_customers = ?";
        db.query(updateQuery, [name, email, phone, id], (err, result) => {
          if (err) {
            console.error("Error updating customer:", err);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (result.affectedRows > 0) {
              res
                .status(200)
                .json({ message: "Customer updated successfully" });
            } else {
              res.status(404).json({ error: "Customer not found" });
            }
          }
        });
      }
    }
  );
});

app.put("/delete-customer/:id", (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE customers SET isDeleted = true WHERE id_customers = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting customer:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "Customer soft deleted successfully" });
      } else {
        res.status(404).json({ error: "Customer not found" });
      }
    }
  });
});

app.get("/users", allowRoles(["Admin", "Cashier"]), (req, res) => {
  const sql = "SELECT * FROM users WHERE isDeleted = 0";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/add-user", allowRoles(["Admin"]), (req, res) => {
  const { firstname, lastname, username, password, role } = req.body;

  const sqlCheckExisting =
    "SELECT * FROM users WHERE (firstname = ? AND lastname = ?) OR username = ?";
  db.query(
    sqlCheckExisting,
    [firstname, lastname, username],
    (err, results) => {
      if (err) {
        console.error("Error checking for existing user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.length > 0) {
        res.status(400).json({
          error: "A user with similar data already exists",
        });
      } else {
        const sqlCheckUsername = "SELECT * FROM users WHERE username = ?";
        db.query(sqlCheckUsername, [username], (err, usernameResults) => {
          if (err) {
            console.error("Error checking for existing username:", err);
            res.status(500).json({ error: "Internal Server Error" });
          } else if (usernameResults.length > 0) {
            res.status(400).json({
              error: "Username already exists",
            });
          } else {
            const userRole = role || "Cashier";
            const sql =
              "INSERT INTO users (firstname, lastname, username, password, role) VALUES (?, ?, ?, ?, ?)";
            db.query(
              sql,
              [firstname, lastname, username, password, userRole],
              (err, result) => {
                if (err) {
                  console.error("Error adding user:", err);
                  res.status(500).json({ error: "Internal Server Error" });
                } else {
                  res.status(200).json({ message: "User added successfully" });
                }
              }
            );
          }
        });
      }
    }
  );
});

app.put("/update-user/:id", allowRoles(["Admin"]), (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, username, role } = req.body;

  const sqlCheckExisting =
    "SELECT * FROM users WHERE (firstname = ? AND lastname = ?) OR username = ?";
  db.query(
    sqlCheckExisting,
    [firstname, lastname, username],
    (err, results) => {
      if (err) {
        console.error("Error checking for existing user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (results.length > 0) {
        const existingUser = results.find((user) => user.id !== id);
        if (existingUser) {
          res.status(400).json({
            error: "A user with similar data already exists",
          });
        } else {
          updateUser();
        }
      } else {
        updateUser();
      }
    }
  );

  const updateUser = () => {
    const sql =
      "UPDATE users SET firstname = ?, lastname = ?, username = ?, role = ? WHERE id_users = ?";
    db.query(sql, [firstname, lastname, username, role, id], (err, result) => {
      if (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        if (result.affectedRows > 0) {
          res.status(200).json({ message: "User updated successfully" });
        } else {
          res.status(404).json({ error: "User not found" });
        }
      }
    });
  };
});

app.put("/delete-user/:id", allowRoles(["Admin"]), (req, res) => {
  const { id } = req.params;

  const sql = "UPDATE users SET isDeleted = true WHERE id_users = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting user:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (result.affectedRows > 0) {
        res.status(200).json({ message: "User soft deleted successfully" });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    }
  });
});

app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products WHERE isDeleted = 0";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/add-product", allowRoles(["Admin"]), (req, res) => {
  const { name_product, price_product } = req.body;

  const sql =
    "INSERT INTO products (name_product, price_product, quantity_product) VALUES (?, ?, ?)";

  const quantity_product = 0; // Set quantity_product to 0

  db.query(
    sql,
    [name_product, price_product, quantity_product],
    (err, result) => {
      if (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ message: "Product added successfully" });
      }
    }
  );
});



app.put("/update-products/:id", allowRoles(["Admin"]), (req, res) => {
  const { id } = req.params;
  const { name_product, price_product, quantity_product } = req.body;

  const sqlSelect =
    "SELECT * FROM products WHERE name_product = ? AND id_product <> ?";
  db.query(sqlSelect, [name_product, id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error("Error selecting product:", selectErr);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      if (selectResult.length > 0) {
        res.status(409).json({ error: "Product name already exists" });
      } else {
        const sqlCheckConflict = "SELECT * FROM products WHERE id_product = ?";
        db.query(sqlCheckConflict, [id], (conflictErr, conflictResult) => {
          if (conflictErr) {
            console.error("Error checking for conflict:", conflictErr);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            if (conflictResult.length === 0) {
              res.status(404).json({ error: "Product not found" });
            } else {
              const sqlUpdate =
                "UPDATE products SET name_product = ?, price_product = ?, quantity_product = ? WHERE id_product = ?";
              db.query(
                sqlUpdate,
                [name_product, price_product, quantity_product, id],
                (updateErr, updateResult) => {
                  if (updateErr) {
                    console.error("Error updating product:", updateErr);
                    res.status(500).json({ error: "Internal Server Error" });
                  } else {
                    if (updateResult.affectedRows > 0) {
                      res
                        .status(200)
                        .json({ message: "Product updated successfully" });
                    } else {
                      res.status(404).json({ error: "Product not found" });
                    }
                  }
                }
              );
            }
          }
        });
      }
    }
  });
});

app.put("/delete-products/:id", allowRoles(["Admin"]), (req, res) => {
  const productId = req.params.id;

  const updateServiceProductsQuery = `UPDATE serviceproducts SET isDeleted = true WHERE product_id = ?`;
  console.log("Updating serviceproducts table:", updateServiceProductsQuery);

  db.query(updateServiceProductsQuery, [productId], (err1, result1) => {
    if (err1) {
      console.error("Error updating service products:", err1);
      res.status(500).json({ error: "Error updating service products" });
    } else {
      const updateProductQuery = `UPDATE products SET isDeleted = true WHERE id_product = ?`;
      console.log("Updating products table:", updateProductQuery);

      db.query(updateProductQuery, [productId], (err2, result2) => {
        if (err2) {
          console.error("Error updating product:", err2);
          res.status(500).json({ error: "Error updating product" });
        } else {
          if (result2.affectedRows > 0) {
            res.json({
              message:
                "Product and associated service products soft deleted successfully.",
            });
          } else {
            console.log("Product not found in products table.");
            res.json({
              message: "Product not found in products table.",
            });
          }
        }
      });
    }
  });
});

app.get("/services-with-products", (req, res) => {
  const query = `
  SELECT
    s.id_service,
    s.name_service,
    s.price_service,
    s.isDeleted,
    GROUP_CONCAT(ps.product_id) AS product_id,
    CASE
        WHEN s.isDeleted = 1 THEN 'Unavailable'
        WHEN MAX(p.isDeleted) = 1 THEN 'Unavailable'
        WHEN SUM(CASE WHEN p.quantity_product = 0 THEN 1 ELSE 0 END) > 0 THEN 'Unavailable'
        ELSE 'Available'
    END AS availability
  FROM
    services s
  LEFT JOIN
    serviceproducts ps ON s.id_service = ps.service_id
  LEFT JOIN
    products p ON ps.product_id = p.id_product
  GROUP BY
    s.id_service, s.name_service, s.price_service
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Server Error");
      return;
    }
    res.json(results);
  });
});

app.get("/services", (req, res) => {
  const sql = "SELECT * FROM services WHERE isDeleted = 0";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/add-service", allowRoles(["Admin"]), (req, res) => {
  try {
    const { name_service, price_service, product_id } = req.body;

    const insertServiceQuery =
      "INSERT INTO services (name_service, price_service) VALUES (?, ?)";
    const serviceValues = [name_service, price_service];

    db.query(insertServiceQuery, serviceValues, (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res
            .status(400)
            .json({ error: "Service with the same name already exists" });
        } else {
          console.error("Error adding product:", err);
          return res.status(500).json({ error: "Internal Server Error" });
        }
      }

      const serviceId = result.insertId;

      if (Array.isArray(product_id)) {
        const insertProductsQuery =
          "INSERT INTO serviceproducts (service_id, product_id) VALUES ?";
        const productValues = product_id.map((productId) => [
          serviceId,
          productId,
        ]);

        db.query(insertProductsQuery, [productValues], (err) => {
          if (err) {
            console.error("Error adding products:", err);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          return res.status(201).json({
            message: "Service added with associated products",
          });
        });
      } else {
        return res.status(400).json({ message: "Invalid product_id format" });
      }
    });
  } catch (error) {
    console.error("Error adding service:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

app.put("/update-service/:id", allowRoles(["Admin"]), (req, res) => {
  const serviceId = req.params.id;
  const { name_service, price_service, product_id } = req.body;

  if (!price_service) {
    return res
      .status(400)
      .json({ error: "Please provide the price_service field." });
  }

  db.beginTransaction(function (err) {
    if (err) {
      return res.status(500).json({ error: "Error beginning transaction." });
    }

    const selectServiceQuery = `
      SELECT name_service
      FROM services
      WHERE id_service = ?
    `;

    db.query(selectServiceQuery, [serviceId], function (error, result) {
      if (error) {
        db.rollback(function () {
          res.status(500).json({ error: "Error retrieving service." });
        });
      } else {
        const existingDataExists = result.length > 0;
        const existingName = existingDataExists ? result[0].name_service : null;

        const updateServiceQuery = `
          UPDATE services
          SET price_service = ?, ${name_service ? "name_service = ?" : ""}
          WHERE id_service = ?
        `;

        const updateParams = name_service
          ? [price_service, name_service, serviceId]
          : [price_service, serviceId];

        db.query(updateServiceQuery, updateParams, function (error, result) {
          if (error) {
            db.rollback(function () {
              res
                .status(500)
                .json({ error: "Cannot edit the name of existing data." });
            });
          } else {
            const deleteServiceProductsQuery = `
              DELETE FROM serviceproducts
              WHERE service_id = ?
            `;

            db.query(deleteServiceProductsQuery, [serviceId], function (error) {
              if (error) {
                db.rollback(function () {
                  res
                    .status(500)
                    .json({ error: "Error deleting service products." });
                });
              } else {
                if (product_id && product_id.length > 0) {
                  const insertServiceProductsQuery = `
                    INSERT INTO serviceproducts (service_id, product_id)
                    VALUES (?, ?)
                  `;

                  const productUpdatePromises = [];

                  for (const productId of product_id) {
                    const productUpdatePromise = new Promise(
                      (resolve, reject) => {
                        db.query(
                          insertServiceProductsQuery,
                          [serviceId, productId],
                          function (error, result) {
                            if (error) {
                              reject(error);
                            } else {
                              resolve(result);
                            }
                          }
                        );
                      }
                    );

                    productUpdatePromises.push(productUpdatePromise);
                  }

                  Promise.all(productUpdatePromises)
                    .then(function () {
                      db.commit(function (err) {
                        if (err) {
                          db.rollback(function () {
                            res.status(500).json({
                              error: "Error committing transaction.",
                            });
                          });
                        } else {
                          res.status(200).json({
                            message: "Service updated successfully.",
                          });
                        }
                      });
                    })
                    .catch(function (updateError) {
                      db.rollback(function () {
                        res.status(500).json({
                          error: "Error updating service products.",
                          updateError,
                        });
                      });
                    });
                } else {
                  db.commit(function (err) {
                    if (err) {
                      db.rollback(function () {
                        res
                          .status(500)
                          .json({ error: "Error committing transaction." });
                      });
                    } else {
                      res
                        .status(200)
                        .json({ message: "Service updated successfully." });
                    }
                  });
                }
              }
            });
          }
        });
      }
    });
  });
});

app.put("/delete-service/:id_service", allowRoles(["Admin"]), (req, res) => {
  const serviceId = req.params.id_service;

  const updateServiceProductsQuery = `UPDATE serviceproducts SET isDeleted = true WHERE service_id = ?`;

  db.query(updateServiceProductsQuery, [serviceId], (err1, result1) => {
    if (err1) {
      console.error("Error updating service products:", err1);
      res.status(500).json({ error: "Error updating service products" });
    } else {
      const updateServiceQuery = `UPDATE services SET isDeleted = true WHERE id_service = ?`;

      db.query(updateServiceQuery, [serviceId], (err2, result2) => {
        if (err2) {
          console.error("Error updating service:", err2);
          res.status(500).json({ error: "Error updating service" });
        } else {
          console.log(
            "Service and associated products soft deleted successfully."
          );
          res.json({
            message:
              "Service and associated products soft deleted successfully.",
          });
        }
      });
    }
  });
});

app.get("/expenses", (req, res) => {
  const sql = `
    SELECT expenses.*, products.name_product
    FROM expenses
    JOIN products ON expenses.product_id = products.id_product
    WHERE expenses.isDeleted = 0
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

app.post("/add-expenses", (req, res) => {
  const { product_id, quantity, total_expense, issued_date } = req.body;

  const sql = `
    INSERT INTO expenses (product_id, quantity, total_expense, issued_date )
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [product_id, quantity, total_expense, issued_date],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        // Update product quantity
        const updateQuantitySql = `
        UPDATE products
        SET quantity_product = quantity_product + ?
        WHERE id_product = ?
      `;

        db.query(updateQuantitySql, [quantity, product_id], (err) => {
          if (err) {
            console.error("Error executing query:", err);
            res.status(500).json({ error: "Internal Server Error" });
          } else {
            res.json({ message: "Expense added successfully" });
          }
        });
      }
    }
  );
});

app.put("/delete-expense/:id_expense", (req, res) => {
  const expenseId = req.params.id_expense;

  const sql = `
    UPDATE expenses
    SET isDeleted = 1
    WHERE id_expense = ?
  `;

  db.query(sql, [expenseId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ error: "Expense not found" });
    } else {
      const updateQuantitySql = `
        UPDATE products
        SET quantity_product = quantity_product - (
          SELECT quantity
          FROM expenses
          WHERE id_expense = ?
        )
        WHERE id_product = (
          SELECT product_id
          FROM expenses
          WHERE id_expense = ?
        )
      `;

      db.query(updateQuantitySql, [expenseId, expenseId], (err) => {
        if (err) {
          console.error("Error executing query:", err);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.json({ message: "Expense deleted successfully" });
        }
      });
    }
  });
});

app.get("/transactions-chart", (req, res) => {
  // Construct the SQL query
  const query = `SELECT t.id_transactions, t.issued_transactions, t.name_service, t.price_service, t.quantity
                 FROM transactions t`;

  // Execute the query
  db.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.json(results);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at port http://localhost:${port}!`);
});
