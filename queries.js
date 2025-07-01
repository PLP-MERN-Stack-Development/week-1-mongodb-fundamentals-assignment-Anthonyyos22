/* ---------------------------------------------
  📁 queries.js - MongoDB CRUD & Aggregation
----------------------------------------------*/

/* ----- Task 2: Basic CRUD Operations ----- */

// 1. Find all books in a specific genre (example: Fiction)
db.books.find({ genre: "Fiction" });


// 2. Find books published after a certain year (example: 1950)
db.books.find({ published_year: { $gt: 1950 } });


// 3. Find books by a specific author (example: George Orwell)
db.books.find({ author: "George Orwell" });


// 4. Update the price of a specific book (example: 1984)
db.books.updateOne(
  { title: "1984" },
  { $set: { price: 15.99 } }
);


// 5. Delete a book by its title (example: Moby Dick)
db.books.deleteOne({ title: "Moby Dick" });

/* ----- Task 3: Advanced Queries ----- */

// 6. Find books that are in stock and published after 2010
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
});


// 7. Projection: return only title, author, price
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
);


// 8. Sort by price ascending
db.books.find().sort({ price: 1 });

// 9. Sort by price descending
db.books.find().sort({ price: -1 });


// 10. Pagination - limit 5 books per page, skip for page 2
db.books.find().limit(5).skip(0);  // Page 1
db.books.find().limit(5).skip(5);  // Page 2

/* ----- Task 4: Aggregation Pipelines ----- */

// 11. Average price of books by genre
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" }
    }
  }
]);


// 12. Find author with the most books
db.books.aggregate([
  { $group: { _id: "$author", count: { $sum: 1 } } },
  { $sort: { count: -1 } },
  { $limit: 1 }
]);


// 13. Group books by publication decade
db.books.aggregate([
  {
    $project: {
      decade: {
        $concat: [
          { $toString: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      totalBooks: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
]);

/* ----- Task 5: Indexing ----- */

// 14. Create index on title
db.books.createIndex({ title: 1 });

// 15. Create compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 });

// 16. Use explain() to show performance improvement
db.books.find({ title: "1984" }).explain("executionStats");
