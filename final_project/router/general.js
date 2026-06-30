const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  let username = req.body.username
  let password = req.body.password
  if(username && password){
    if(!(users.some(user=> user.username === username))){
        users.push({"username":username, "password":password})
        return res.status(200).json({message:"User successfully registered. now you can login"})
    }else{
        return res.status(404).json({message:"User already exist"})
    }
  }
  return res.status(404).json({message: "Unable to register user"});
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
  let title = req.params.title
  const matchedBooks = []
  for(const [key, book] of Object.entries(books)){
    if(book.title.toLowerCase() === title.toLowerCase()){
        matchedBooks.push({key, ...book})
    }
  }
  if(matchedBooks.length>0){
    return res.send(matchedBooks)
  }else{
    return res.status(402).json({message: "Book not found"});
  }
  
  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn
  if(isbn){

    return res.send(books[isbn].reviews)
  }else{
    return res.status(300).json({message: "Book Not found"});
  }
  
});

module.exports.general = public_users;
