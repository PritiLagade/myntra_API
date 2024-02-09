const express = require("express");

const mysql = require('mysql2');
const router = express.Router();
const con = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root123",
    database: "myntra"
  });
  
  con.connect((error) => {
    if (error) {
        console.error(error);
    } else {
        console.log('Connected to the database');
    }
  });



// GET All Users
const getAllUsers = async (req, res) => {
    try {
      const { limit, offset, sort } = req.query;
      console.log(req.query)
      if (!limit || !offset || !sort) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
      
      let queryString = `SELECT user_id, name, email, is_active, password FROM users ORDER BY user_id ${sort} LIMIT ? OFFSET ? `;
      const [result] = await con.promise().execute(queryString, [limit,offset]);
  
      let countQueryString = `SELECT COUNT(user_id) AS count FROM users `;
      const [countResult] = await con.promise().execute(countQueryString);
  
      const responseBody = {
        message: "Successfully got all users",
        list: result,
        count: countResult[0].count,
      };
      res.status(200).send(responseBody);
    } catch (error) {
      console.log(error);
      res.status(500).send({
        message: "Error while getting users",
        error,
      });
    }
  };
  
  
  // GET Specific user
  const getUserById = async (req, res) => {
    try {
      const { user_id } = req.params;
      
      if (!user_id) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
     
      let queryString = `SELECT name, email FROM users WHERE user_id = ?`;
      const [result] = await con.promise().execute(queryString, [user_id]);
  
      if (result.length === 0) {
        res.status(404).send({
          message: "User not found",
        });
        return;
      }
      res.status(200).send({
        message: "User found successfully!",
        result,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error while getting user",
        error,
      });
    }
  };
  
  
  // POST User
  const createUser = async (req, res) => {
    try {
      const { name, email, password ,gender} = req.body;
    
      if (!name || !email || !password || gender) {
        res.status(400).send({
          message: "Bad request. Name, email, password and gender are required fields.",
        });
        return;
      }
      
      const queryString = `INSERT INTO users (name, email, password,gender) VALUES (?, ?, ?, ?);`;
      const [result] = await con.promise().execute(queryString, [name, email, password, gender]);
  
      res.status(201).send({
        message: "User created successfully",
        user_id: result.insertId,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while creating user",
        error: error.message,
      });
    }
  };
  
  
  // PUT User
  const updateUser = async (req, res) => {
    try {
      const { user_idid } = req.params;
      const { name, email, password } = req.body;
  
      if (!user_id) {
        res.status(400).send({
          message: "Bad request. User ID is required.",
        });
        return;
      }
  
      const queryString = `UPDATE users SET name=?, email=?, password=? WHERE id=?`;
      const [result] = await con.promise().execute(queryString, [name, email, password, user_id]);
  
      if (result.affectedRows === 0) {
        res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(200).send({
          message: "User updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while updating user",
        error: error.message,
      });
    }
  };
  
  
  // DELETE User
  const deleteUser = async (req, res) => {
    try {
      const { user_id } = req.params;
  
      if (!user_id) {
        res.status(400).send({
          message: "Bad request. User ID is required.",
        });
        return;
      }
  
      const queryString = `DELETE FROM users WHERE id=?`;
      const [result] = await con.promise().execute(queryString, [user_id]);
  
      if (result.affectedRows === 0) {
        res.status(404).send({
          message: "User not found",
        });
      } else {
        res.status(200).send({
          message: "User deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while deleting user",
        error: error.message,
      });
    }
  };
  
  //User routes
  router.get("/v1/users", getAllUsers);
  router.get("/v1/users/:id", getUserById);
  router.post("/v1/users", createUser);
  router.put("/v1/users/:id", updateUser);
  router.delete("/v1/users/:id", deleteUser);
  
  // GET All Products
  const getAllProducts = async (req, res) => {
    try {
      const { limit, offset, sort, sortType, start_price, end_price, type } = req.query;
     
      if (!limit || !offset || !sort || !sortType) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
      let whereArray = [];
      let whereData = [];
      let sortArray = [];
  
      if (start_price && end_price) {
        whereArray.push("price BETWEEN ? AND ?");
        whereData.push(start_price);
        whereData.push(end_price);
      }
  
      if (type) {
        whereArray.push("category = ?");
        whereData.push(type);
      }
  
      if (sort && sortType) {
        sortArray.push(`${sort} ${sortType}`);
      }
  
      let sortString = "";
      if (sortArray.length) {
        sortString = `ORDER BY ${sortArray.join(", ")}`;
      }
  
      let whereString = "";
      if (whereArray.length) {
        whereString = `WHERE ${whereArray.join(" AND ")}`;
      }
  
      let queryString = `SELECT id, name, start_price,end_price,rating,description,size_id,image_URL,type FROM products
       ${whereString} ${sortString} LIMIT ? OFFSET ?;`;
  
      const [result] = await con
        .promise()
        .execute(queryString, [...whereData, [limit,offset]]);
  
      let countQueryString = `SELECT COUNT(id) AS count FROM products ${whereString}`;
      const [countResult] = await con
      .promise()
      .execute(countQueryString, whereData);
  
      const responseBody = {
        message: "Successfully got all products",
        list: result,
        count: countResult[0].count,
      };
      res.status(200).send(responseBody);
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while getting products",
        error: error.message,
      });
    }
  };
  
  
  // GET Specific Product
  const getProductById = async (req, res) => {
    try {
      const { product_id } = req.params;
      
      if (!product_id) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
      
      let queryString = `SELECT
      U.user_id AS userId,
      U.name AS userName,
      P.name AS productName,
      P.description AS description,
      P.image_URL AS image,
      P.start_price AS startPrice,
      P.end_price AS endPrice,
      W.quantity AS quantity, 
      W.is_active AS isActive 
  FROM 
      wishlists AS W
      INNER JOIN products AS P ON P.product_id = W.product_id
      INNER JOIN users AS U ON U.user_id = W.user_id
  WHERE 
      U.user_id = ?;
  `;
  
      const [result] = await con.promise().execute(queryString, [id]);
  
      if (result.length === 0) {
        res.status(404).send({
          message: "Product not found",
        });
        return;
      }
      res.status(200).send({
        message: "Successfully found the product",
        result,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error while getting product",
        error,
      });
    }
  };
  
  
  // POST Product
  const createProduct = async (req, res) => {
    try {
      const { name, start_price, end_price, description, rating, type, size_id, image_URL } = req.body;
  
      // Validate request parameters
      if (!name || !start_price || !end_price || !description || !rating || !type || !size_id || !image_URL) {
        res.status(400).send({
          message: 'Bad request. All fields are required.',
        });
        return;
      }
  
      // SQL query to insert a new product into the 'products' table
      const queryString = `
        INSERT INTO products (name, start_price, end_price, description, rating, type, size_id, image_URL)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`;
  
      // Execute the SQL query and retrieve the result
      const [result] = await con
      .promise()
      .execute(queryString, [name, start_price, end_price, description, rating, type, size_id, image_URL]);
  
      // Send a success response with the created product's ID
      res.status(201).send({
        message: 'Product created successfully',
        product_id: result.insertId,
      });
    } catch (error) {
      // Handle any errors that occur during the process
      console.error(error);
      res.status(500).send({
        message: 'Error while creating product',
        error: error.message,
      });
    }
  }
  
  // PUT Product
  const updateProduct = async (req, res) => {
    try {
      const { product_id } = req.params;
      const { name, start_price, end_price, description, rating, type, size_id, image_URL } = req.body;
  
      // Validate if product ID is provided
      if (!product_id) {
        res.status(400).send({
          message: "Bad request. Product ID is required.",
        });
        return;
      }
  
      // Construct the SQL query for updating the product
      const queryString = `
        UPDATE products
        SET name=?, start_price=?, end_price=?, description=?, rating=?, type=?, size_id=?, image_URL=?
        WHERE product_id=?`;
  
      // Execute the SQL query and get the result
      const [result] = await con
      .promise().execute(queryString, [name, start_price, end_price, description, rating, type, size_id, image_URL, id]);
  
      // Check if the product was found and updated
      if (result.affectedRows === 0) {
        res.status(404).send({
          message: "Product not found",
        });
      } else {
        res.status(200).send({
          message: "Product updated successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while updating product",
        error: error.message,
      });
    }
  };
  // DELETE Product
  const deleteProduct = async (req, res) => {
    try {
      const { product_id } = req.params;
  
      // Validate if product ID is provided
      if (!product_id) {
        res.status(400).send({
          message: "Bad request. Product ID is required.",
        });
        return;
      }
  
      // Construct the SQL query for deleting the product
      const queryString = `DELETE FROM products WHERE product_id=?`;
  
      // Execute the SQL query and get the result
      const [result] = await con
      .promise()
      .execute(queryString, [product_id]);
  
      // Check if the product was found and deleted
      if (result.affectedRows === 0) {
        res.status(404).send({
          message: "Product not found",
        });
      } else {
        res.status(200).send({
          message: "Product deleted successfully",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "Error while deleting product",
        error: error.message,
      });
    }
  };
  //Product routes
  router.get("/v1/products", getAllProducts);
  router.get("/v1/products/:id", getProductById);
  router.post("/v1/products", createProduct);
  router.put("/v1/products/:id", updateProduct);
  router.delete("/v1/products/:id", deleteProduct);
  
  
  // get Wishlist
  const getwishlists = async (req, res) => {
    try {
      const { user_id } = req.headers;
      
      if (!user_id) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
  
      let queryString = `SELECT
      C.user_id AS userId,
      C.name AS userName,
      B.name AS productName,
      B.description AS description,
      B.image_URL AS image,
      B.start_price AS startPrice,
      B.end_price AS endPrice,
      A.quantity AS quantity, 
      A.is_active AS isActive 
      FROM wishlists AS A
      INNER JOIN products AS B ON B.product_id = A.product_id
      INNER JOIN users AS C ON C.user_id = A.user_id WHERE C.user_id = ?`;
      const [result] = await con
      .promise()
      .execute(queryString, [user_id]);
  
      if (result.length === 0) {
        res.status(404).send({
          message: "Nothing in the wishlist",
        });
        return;
      }
      let countQueryString = `SELECT COUNT(C.id) AS count FROM wishlists AS A
      INNER JOIN products AS B ON B.productID = A.product_id
      INNER JOIN users AS C ON C.user_id = A.userID WHERE C.user_id = ?;`;
      const [countResult] = await con
      .promise()
      .execute(countQueryString, [user_id]);
  
      const responseBody = {
        message: "Successfully got wishlist",
        list: result,
        count: countResult[0].count,
      };
      res.status(200).send(responseBody);
    } catch (error) {
      res.status(500).send({
        message: "Error while getting wishlist",
        error,
      });
    }
  };
  
  
  // create wishlist
  const createwishlist = async (req, res) => {
    try {
      const { user_id, product_id, is_active, quantity } = req.body;
      if (!user_id || !product_id || !is_active || !quantity) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
  
      let queryString = `INSERT INTO wishlist
      (user_id, product_id, is_active, quantity)
       VALUES (?, ?, ?, ?)`;
      const [result] = await con
        .promise()
        .execute(queryString, [user_id, product_id, is_active, quantity]);
  
      res.status(201).send({
        message: "Wishlist created successfully",
        result,
      });
    } catch (error) {
      res.status(500).send({
        message: "Error while creating wishlist",
        error,
      });
    }
  };
  
  
  // update wishlist
  const updatewishlist = async (req, res) => {
    try {
      const { quantity } = req.body;
      const { user_id } = req.headers;
  
      if (!user_id || !quantity) {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
  
      let queryString = `UPDATE wishlists SET quantity = ? WHERE user_id = ?`;
      const [result] = await con
      .promise()
      .execute(queryString, [quantity, user_id]);
      if (result.affectedRows === 0) {
        res.status(404).send({
          message: "Nothing to update in the wishlist",
        });
        return;
      }
      let countQueryString = `SELECT COUNT(C.id) AS count FROM wishlists AS A
      INNER JOIN products AS B ON B.product_id = A.product_id
      INNER JOIN users AS C ON C.wishlists_id = A.user_id WHERE C.user_id = ?;`;
      const [countResult] = await con
      .promise()
      .execute(countQueryString, [user_id]);
      
      const responseBody = {
        message: "Wishlist updated successfully",
        list: result,
        count: countResult[0].count,
      };
      res.status(200).send(responseBody);
      } catch (error) {
      res.status(500).send({
      message: "Error while updating wishlist",
      error,
      });
      }
      };
      
      
  // DELETE wishlist
    const deletewishlist = async (req, res) => {
      try {
      const { is_active } = req.body;
      const { user_id } = req.headers;
      if (!user_id || is_active !== '0') {
        res.status(400).send({
          message: "Bad request",
        });
        return;
      }
      
      let queryString = `UPDATE wishlists SET is_active = ? WHERE user_id = ?;`;
      const [result] = await con
        .promise()
        .execute(queryString, [is_active, user_id]);
      
      if (result.affectedRows === 0) {
        res.status(404).send({
          message: "Nothing to delete in the wishlist",
        });
        return;
      }
      let countQueryString = `SELECT COUNT(C.id) AS count FROM wishlists AS A
      INNER JOIN products AS B ON B.id = A.product_id
      INNER JOIN users AS C ON C.id = A.user_id WHERE C.id = ?;`;
      const [countResult] = await con
      .promise().execute(countQueryString, [user_id]);
      
      const responseBody = {
        message: "Wishlist deleted successfully",
        list: result,
        count: countResult[0].count,
      };
      res.status(200).send(responseBody);
      } catch (error) {
      res.status(500).send({
      message: "Error while deleting wishlist",
      error,
      });
      }
      };
      
    //Wishlist routes
      router.get("/v1/wishlist", getwishlists);
      router.post("/v1/wishlist", createwishlist);
      router.delete("/v1/wishlist/:id", deletewishlist);
      router.put("/v1/wishlist/:id", updatewishlist);

      module.exports = router;
  
