const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const reviewsFilePath = path.join(__dirname, 'public', 'reviews.json');

// Load routes
app.use('/', require('./routes/index'));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});