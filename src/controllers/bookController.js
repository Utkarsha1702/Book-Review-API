const Book = require("../models/Book");
const Review = require("../models/Review");

// Add a new book (Authenticated)
exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = await Book.create({ title, author, genre });
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all books (with optional filters + pagination)
exports.getBooks = async (req, res) => {
  try {
    const { author, genre, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (author) filter.author = new RegExp(author, "i");
    if (genre) filter.genre = new RegExp(genre, "i");

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get book details by ID (with reviews + avg rating)
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("reviews");
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ book: book._id });

    const avgRating =
      reviews.length > 0
        ? reviews.reduce((acc, cur) => acc + cur.rating, 0) / reviews.length
        : 0;

    res.json({ ...book._doc, averageRating: avgRating, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Submit a review (only one per user per book)
exports.addReview = async (req, res) => {
  try {
    const existing = await Review.findOne({
      user: req.user._id,
      book: req.params.id,
    });
    if (existing)
      return res
        .status(400)
        .json({ message: "You already reviewed this book" });

    const { rating, comment } = req.body;
    const review = await Review.create({
      user: req.user._id,
      book: req.params.id,
      rating,
      comment,
    });

    await Book.findByIdAndUpdate(req.params.id, {
      $push: { reviews: review._id },
    });

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update your own review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const { rating, comment } = req.body;
    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    await review.save();

    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete your own review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review || review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Review.findByIdAndDelete(req.params.id);
    await Book.findByIdAndUpdate(review.book, {
      $pull: { reviews: review._id },
    });

    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Search books by title or author
exports.searchBooks = async (req, res) => {
  try {
    const { query } = req.query;
    const regex = new RegExp(query, "i");

    const books = await Book.find({
      $or: [{ title: regex }, { author: regex }],
    });

    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



