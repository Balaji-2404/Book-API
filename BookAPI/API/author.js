const Router = require("express").Router();
const AuthorModel = require("../schema/author");

/*
Route    - /author
Des      - to get all the authors
Access   - Public
Method   - GET
Params   - none
Body     - none
*/
Router.get("/author", async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

/*
Route         /author
Description   to get a specific author based on the id of the author
Access        Public
Parameter     name
Methods       GET
*/
Router.get("/:id", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    id: req.params.id,
  });
  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found for the id of ${req.params.name}`,
    });
  }

  return res.json({ author: getSpecificAuthor });
});

/*
Route         /author/book
Description   to get all authors based on books
Access        Public
Parameter     isbn
Methods       GET
*/
Router.get("/book/:isbn", async (req, res) => {
  const getSpecificAuthor = await AuthorModel.findOne({
    books: req.params.isbn,
  });
  // const getSpecificAuthor=database.author.filter((author)=>author.books.includes(req.params.isbn))

  if (!getSpecificAuthor) {
    return res.json({
      error: `No author found for the Book ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ Authors: getSpecificAuthor });
});

/*
Route         /author/new
Description   to add a new author
Access        PUBLIC
Parameters    NONE
METHOD        POST
*/
Router.post("/new", async (req, res) => {
  try {
    const { newAuthor } = req.body;
    await AuthorModel.create(newAuthor);
    return res.json({ message: "Author was added successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route       /author/update/name
Description to update the name of the author
Access      Public
Parameters  id
Method      Put
*/
// Params in the req.body are always in string format
Router.put("/update/name/:id", async (req, res) => {
  const UpdatedAuthor = await AuthorModel.findOneAndUpdate(
    { id: parseInt(req.params.id) },
    {
      name: req.body.newAuthorName,
    },
    {
      new: true,
    }
  );

  // database.author.forEach((author) => {
  //     if(author.id=== parseInt(req.params.id)){
  //         author.name=req.body.newAuthorName;
  //        return
  //     }
  // });
  return res.json({ author: UpdatedAuthor });
});

/*
Route               /author/delete
Description         to delete an author
Access              PUBLIC
Parameters          id
Method              DELETE
*/
Router.delete("/delete/:id", async (req, res) => {
  const updateAuthorDatabase = await AuthorModel.findOneAndDelete({
    id: req.params.id,
  });

  // const updateAuthorDatabase=database.author.filter((author)=>author.id!==parseInt(req.params.id))
  // database.author=updateAuthorDatabase;
  if (!updateAuthorDatabase) {
    return res.json({ message: "author was not found" });
  }
  return res.json({
    authors: updateAuthorDatabase,
    message: "author deleted successful",
  });
});

module.exports = Router;
