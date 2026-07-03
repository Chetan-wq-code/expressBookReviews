const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios')


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
public_users.get('/',async function (req, res) {
  try{
    const getBooks = new Promise((resolve, reject)=>{
        if(books){
            resolve(books)
        }else{
            reject(res.status(404).json({message:"Books not found"}))
        }
    })

    const allBooks = await getBooks
    return res.status(200).json(allBooks)
  }catch(error){
    return res.status(500).json({message:error.message})
  }
  
});

// Get book details based on ISBN

public_users.get('/isbn/:isbn',async function (req, res) {
    let isbn = req.params.isbn
    if(isbn){
        return res.status(200).send(books[isbn])
    }else{
        return res.status(404).json({message:"Book Not Found"})
    }
});

public_users.get('/isbn/:isbn',async function (req, res) {
  try{
    let isbn = req.params.isbn
    const response =await axios.get(`http://localhost:5000/isbn/${isbn}`)
    return res.status(200).json(response.data)
    
  }catch(err){
    return res.status(404).json({message:err.message})
  }

 });
//  The first route (/isbn/:isbn) acts as the "Inventory Server" holding the database.
// The second route (/async-isbn/:isbn) acts as the "User Server" using Axios to ask for the data over the network.
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try{
        const author = req.params.author
        const getBooks = new Promise((resolve, reject)=>{
            let matchingBooks = []
            for(let isbn in books){
                if(books[isbn].author === author){
                    matchingBooks.push({id:isbn, ...books[isbn]})
                }
            }

            if(matchingBooks.length>0){
                resolve(matchingBooks)
            }else reject(new Error("No books found for this author"))
        })

        const foundBooks = await getBooks
        return res.status(200).json(foundBooks)
    }catch(err){
        return res.status(404).json({message:err.message})
    }
//   let author = req.params.author
//   let bookKeys = Object.keys(books)
//   const matchedKeys = bookKeys.filter(key =>{
//     const book = books[key]
//     return book.author.toLowerCase() === author.toLowerCase()
//   })

//   const matchedBooks = matchedKeys.map(key=>{
//     return {id:key, ...books[key]}
//   })

//   if(matchedBooks.length > 0){
//     res.send(matchedBooks)
//   }else{
//     res.status(402).json({message:"Book not found"})
//   }
  
    

    
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

public_users.get('/title/:title', async function (req, res){
    const title = req.params.title
    try{
        const response = await axios.get(`http://localhost:5000/title/${title}`)
        return res.status(200).json(response.data)
    }catch(err){
        return res.status(500).json({message:err.message})
    }
})

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
