 
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const reviewsFilePath = path.join(__dirname, '../public/reviews.json');

// Load home page
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Get reviews
router.get('/reviews', (req, res) => {
  fs.readFile(reviewsFilePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read reviews data' });
    } else {
      const reviews = JSON.parse(data);
      res.json(reviews);
    }
  });
});

// Add a new review
router.post('/add-review', (req, res) => {
  const { name, email, rating, reviewText } = req.body;

  fs.readFile(reviewsFilePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read reviews data' });
    } else {
      const reviews = JSON.parse(data);
      const review = {
        id: Date.now(),
        name,
        email,
        rating: parseInt(rating),
        reviewText,
      };
      reviews.push(review);

      fs.writeFile(reviewsFilePath, JSON.stringify(reviews), (err) => {
        if (err) {
          res.status(500).json({ error: 'Failed to save review' });
        } else {
          res.json({ success: true });
        }
      });
    }
  });
});

// Delete a review
router.delete('/delete-review/:id', (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  fs.readFile(reviewsFilePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read reviews data' });
    } else {
      const reviews = JSON.parse(data);
      const reviewIndex = reviews.findIndex(r => r.id === parseInt(id) && r.email === email);

      if (reviewIndex > -1) {
        reviews.splice(reviewIndex, 1);
        fs.writeFile(reviewsFilePath, JSON.stringify(reviews), (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to delete review' });
          } else {
            res.json({ success: true });
          }
        });
      } else {
        res.status(403).json({ error: 'Unauthorized to delete this review' });
      }
    }
  });
});

// Edit a review
router.put('/edit-review/:id', (req, res) => {
  const { id } = req.params;
  const { email, updatedReviewText, updatedRating } = req.body;

  fs.readFile(reviewsFilePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read reviews data' });
    } else {
      const reviews = JSON.parse(data);
      const reviewIndex = reviews.findIndex(r => r.id === parseInt(id) && r.email === email);

      if (reviewIndex > -1) {
        reviews[reviewIndex].reviewText = updatedReviewText;
        reviews[reviewIndex].rating = parseInt(updatedRating);

        fs.writeFile(reviewsFilePath, JSON.stringify(reviews), (err) => {
          if (err) {
            res.status(500).json({ error: 'Failed to update review' });
          } else {
            res.json({ success: true });
          }
        });
      } else {
        res.status(403).json({ error: 'Unauthorized to edit this review' });
      }
    }
  });
});

module.exports = router;