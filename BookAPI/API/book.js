const Router = require("express").Router();

const BookModel = require("../schema/book");

/*
Route    - /book
Des      - To get all books
Access   - Public
Method   - GET
Params   - none
Body     - none
*/
Router.get("/book", async (req, res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

/*
Route    - /book/is
Des      - To get a book based on the ISBN
Access   - Public
Method   - GET
Params   - bookID
Body     - none
*/
Router.get("/is/:isbn", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    ISBN: req.params.isbn,
  });

  if (!getSpecificBook) {
    return res.json({
      error: `No book found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ book: getSpecificBook });
});

/*
Route    - /book/c
Des      - to get a list of books based on category
Access   - Public
Method   - GET
Params   - category
Body     - none
*/
Router.get("/book/c/:category", async (req, res) => {
  const getSpecificBooks = await BookModel.findOne({
    category: req.params.category,
  });

  if (!getSpecificBooks) {
    return res.json({
      error: `No book found for the category of ${req.params.category}`,
    });
  }

  return res.json({ books: getSpecificBooks });
});

/*
Route          - /lang
Description    - get specific  book based on language
Access         - public
Parameter      - language
Methods        - get
*/

Router.get("/lang/:language", async (req, res) => {
  const getSpecificBook = await BookModel.findOne({
    language: req.params.language,
  });
  // const getSpecificBook=database.books.filter((book)=>book.language===req.params.language)
  if (!getSpecificBook) {
    return res.json({
      error: `No Book found for the language of ${req.params.language}`,
    });
  }

  return res.json({ books: getSpecificBook });
});

/*
Route       /book/new
Description add new book
Access      PUBLIC
Parameters  NONE
Method      POST
*/
Router.post("/new", async (req, res) => {
  try {
    const { newBook } = req.body;

    await BookModel.create(newBook);
    return res.json({ message: "Book added to the database successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route           /book/update/title
Description     update title of a book
Access          PUBLIC
Parameters      isbn
Method          PUT
*/
Router.put("/update/title/:isbn", async (req, res) => {
  const UpdatedBook = await BookModel.findOneAndUpdate(
    { ISBN: req.params.isbn },
    {
      title: req.body.newBookTitle,
    },
    {
      new: true,
    }
  );

  // database.books.forEach((book) => {
  //     if(book.ISBN === req.params.isbn){
  //         book.title=req.body.newBookTitle;
  //        return
  //     }
  // });
  return res.json({ book: UpdatedBook });
});

/*
Route       /book/update/author
Description update/add new author to a book
Access      Public
Paramteters isbn
Method      put
*/
Router.put("/update/author/:isbn/:authoID", async (req, res) => {
  //update thee book database
  const UpdatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $addToSet: {
        authors: req.params.authoID,
      },
    },
    {
      new: true,
    }
  );
  // database.books.forEach((book)=>{
  //     if (book.ISBN===req.params.isbn){
  //         return book.author.push(parseInt(req.params.authoID))
  //     }

  //     })

  //update author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: req.params.authoID,
    },
    {
      $addToSet: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );
  //     database.author.forEach((author)=>{
  //         if (author.id===parseInt(req.params.authoID)){
  //             return author.books.push(req.params.isbn)
  //         }
  // })

  return res.json({
    books: UpdatedBook,
    auhtor: updatedAuthor,
    message: "New author was added",
  });
});

/*
Route               /book/delete
Description         delete a book
Access              PUBLIC
Parameters          isbn
Method              DELETE
*/
Router.delete("/delete/:isbn", async (req, res) => {
  const updateBookDatabase = await BookModel.findOneAndDelete({
    ISBN: req.params.isbn,
  });
  if (!updateBookDatabase) {
    return res.json({ message: "Book was not found" });
  }

  // const updateBookDatabase=database.books.filter((book)=>book.ISBN!==req.params.isbn)
  // database.books=updateBookDatabase
  return res.json({ books: updateBookDatabase, message: "book was deleted" });
});

/*
Route                   /book/delete/author
Description             delte an author from a book
Access                  PUBLIC
Parameters              authorID, isbn
Method                  DELETE
*/
Router.delete("/delete/author/:isbn/:authorID", async (req, res) => {
  //update the book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      $pull: {
        authors: parseInt(req.params.authorID), //use parseInt or not both are fine
      },
    },
    { new: true }
  );
  // database.books.forEach((book)=>{
  //     if(book.ISBN===req.params.isbn){
  //         const newAuthorList=book.authors.filter((author)=>author!==parseInt(req.params.authorID))

  //         book.authors=newAuthorList
  //         return;
  //     }
  // })

  //update the author database
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    {
      id: parseInt(req.params.authorID), //use parseInt or not both are fine
    },
    {
      $pull: {
        books: req.params.isbn,
      },
    },
    {
      new: true,
    }
  );

  //     database.author.forEach((author)=>{
  //         if(author.id===parseInt(req.params.authorID)){
  //             const newBooksList=author.books.filter((book)=> book!==req.params.isbn)
  //             author.books=newBooksList
  //             return;
  //         }
  //  })

  return res.json({
    books: updatedBook,
    author: updatedAuthor,
    message: "author was deleted successfully",
  });
});

module.exports = Router;
