const express = require("express");
const router = express.Router();
const {
  addBook,
  getBooks,
  getBookById,
  addReview,
  updateReview,
  deleteReview,
  searchBooks,
} = require("../controllers/bookController");

const { auth } = require("../middlewares/authMiddleware");

// Book Routes
router.post("/books", auth, addBook);
router.get("/books", getBooks);
router.get("/books/:id", getBookById);

// Review Routes
router.post("/books/:id/reviews", auth, addReview);
router.put("/reviews/:id", auth, updateReview);
router.delete("/reviews/:id", auth, deleteReview);

// Search
router.get("/search", searchBooks);

module.exports = router;
