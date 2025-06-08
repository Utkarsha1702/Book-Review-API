# Book Review API

A simple backend project using **Node.js**, **Express**, and **MongoDB**. It allows users to sign up, log in, add books, and post reviews.

---

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- bcrypt.js (Password hashing)
- dotenv (Environment config)

---

## Features

- User signup and login with JWT
- Add and view books
- View book details with average rating and reviews
- Post one review per user per book
- Update or delete your own review
- Search books by title or author
- Pagination and filtering supported

---

## Folder Structure

book-review-api/
├── src/
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ ├── app.js
│ └── server.js
├── .env
├── .gitignore
├── package.json


## Create .env file
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key

