const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({
    username: username,
    password: password
  });

  return res.status(200).json({
    message: "User successfully registered"
  });
});


// =====================================================
// TASK 10 - Get all books using Async/Await + Axios
// =====================================================

public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(
      'http://localhost:5000/internal/books'
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books"
    });
  }
});


// Internal data endpoint
public_users.get('/internal/books', function (req, res) {
  return res.status(200).json(books);
});


// =====================================================
// TASK 11 - Get book by ISBN using Promise + Axios
// =====================================================

public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  axios
    .get(
      `http://localhost:5000/internal/isbn/${encodeURIComponent(isbn)}`
    )
    .then(function (response) {
      return res.status(200).json(response.data);
    })
    .catch(function (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          message: "Book not found"
        });
      }

      return res.status(500).json({
        message: "Error retrieving book"
      });
    });
});


// Internal data endpoint
public_users.get('/internal/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


// =====================================================
// TASK 12 - Get books by author using Async/Await + Axios
// =====================================================

public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;

  try {
    const response = await axios.get(
      `http://localhost:5000/internal/author/${encodeURIComponent(author)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books by author"
    });
  }
});


// Internal data endpoint
public_users.get('/internal/author/:author', function (req, res) {
  const author = req.params.author;
  const result = {};

  Object.keys(books).forEach(function (key) {
    if (books[key].author === author) {
      result[key] = books[key];
    }
  });

  return res.status(200).json(result);
});


// =====================================================
// TASK 13 - Get books by title using Async/Await + Axios
// =====================================================

public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;

  try {
    const response = await axios.get(
      `http://localhost:5000/internal/title/${encodeURIComponent(title)}`
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({
      message: "Error retrieving books by title"
    });
  }
});


// Internal data endpoint
public_users.get('/internal/title/:title', function (req, res) {
  const title = req.params.title;
  const result = {};

  Object.keys(books).forEach(function (key) {
    if (books[key].title === title) {
      result[key] = books[key];
    }
  });

  return res.status(200).json(result);
});


// =====================================================
// TASK 5 - Get book review
// =====================================================

public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});


module.exports.general = public_users;