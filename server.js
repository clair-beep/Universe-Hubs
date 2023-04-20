require('dotenv').config();
const express = require('express');

const path = require('path');
const colors = require('colors');
const app = express();
const PORT = process.env.PORT || 3000;
const articles = require('./routes/articles');

app.set('view engine', 'ejs');

// serve the static files (e.g., CSS and JavaScript files) in the 'public' directory
app.use(express.static('public'));

app.use('/', articles);

app.listen(
  PORT,
  console.log(`Server running in nodemon mode on port ${PORT}`.cyan),
);

// Handle unhandled promise rejections
