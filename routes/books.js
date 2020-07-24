var express = require('express');
var router = express.Router();
const Book = require('../models').Book;
const { Op } = require('../models').Sequelize;

const booksPerPage = 5;

function asyncHandler(cb){
  return async(req,res,next) => {
    try{
      await cb(req,res,next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

//paginate the all books page
router.get('/pag/:pag', asyncHandler(async(req, res) =>{
    const books = await Book.findAll({order: [["title", "ASC"]]});
    const pages = books.length/booksPerPage;
    const start = (parseInt(req.params.pag) * booksPerPage) - booksPerPage;
    const finish = start + booksPerPage;
    if(start + 1>books.length){
      res.render('not_found')
    } else if(isNaN(req.params.pag)){
      res.render('not_found')
    }else{
    const pagBooks = books.slice(start, finish);
    res.render('books', {books: pagBooks, pages})
    }
}))  

//Redirect /books to show pagination
router.get('/', asyncHandler(async(req, res) => {
  res.redirect("/books/pag/1")
}));

//search
router.post('/search', asyncHandler(async(req,res) => {
    search = true;
    const books = await Book.findAll({
      where: {
        [Op.or]: {
          title: 
          {
            [Op.like]: `%${req.body.query}%`
          },
          author:
          {
            [Op.like]: `%${req.body.query}%`
          },
          genre:
          {
            [Op.like]: `%${req.body.query}%`
          },
          year:
          {
            [Op.like]: `%${req.body.query}%`
          }
        }
      }
    });
     await res.render('books', {books});
  
}))


//Create new book form
router.get('/new', asyncHandler(async(req, res) => {
  res.render('books_new', {})
}));

//Post new book to database
router.post('/', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books/" + book.id);
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      console.log(JSON.stringify(req.body));
      book = await Book.build(req.body);
      res.render("books_new", { book, errors: error.errors })
    } else {
      throw error;
    }  
  }
}));

//show book detail
router.get('/:id', asyncHandler(async(req, res) => {
  const book = await Book.findByPk(req.params.id)
  if(book){
  res.render('books_detail', {book, id: req.params.id})
  } else {
    res.render('not_found');
  }
}));
module.exports = router;

//Edit form
router.get('/:id/edit', asyncHandler(async(req, res)=>{
  const book = await Book.findByPk(req.params.id);
  if(book){
    res.render('book_edit', {book})
  } else {
    res.render('not_found');
  }
}));


//Update edit
router.post('/:id/edit', asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if(book) {
      await book.update(req.body);
      res.redirect("/books/" + book.id); 
    } else {
      res.render('not_found');
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("book_edit", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

//Confirm delete form
router.get("/:id/delete", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("book_delete", { book, title: "Delete Book" });
  } else {
    res.render('not_found');
  }
}));

//Delete book
router.post('/:id/delete', asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    res.render('not_found');
  }
}));