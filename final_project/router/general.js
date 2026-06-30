const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if(isbn){
    res.send(books[isbn])
  }

    


  return res.status(400).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let author = req.params.author
  let bookKeys = Object.keys(books)
  const matchedKeys = bookKeys.filter(key =>{
    const book = books[key]
    return book.author.toLowerCase() === author.toLowerCase()
  })

  const matchedBooks = matchedKeys.map(key=>{
    return {id:key, ...books[key]}
  })

  if(matchedBooks.length > 0){
    res.send(matchedBooks)
  }else{
    res.status(402).json({message:"Book not found"})
  }
  
    

    
  });
  


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
