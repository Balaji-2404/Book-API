const Router = require("express").Router();

const PublicationModel = require("../../database/publication");

/*
Route           /publication
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/
Router.get("/", async (req, res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json({ getAllPublications });
});

/*
Route         /publication
Description   Get specific publication 
Access        Public
Parameter     name
Methods       GET
*/
Router.get("/:id", async (req, res) => {
  const getSpecificpublication = await PublicationModel.findOne({
    id: req.params.id,
  });

  if (!getSpecificpublication) {
    return res.json({
      error: `No publication found for the id of ${req.params.id}`,
    });
  }

  return res.json({ publications: getSpecificpublication });
});

/*
Route         /publication/book
Description   Get list of publications based on book 
Access        Public
Parameter     isbn
Methods       GET
*/
Router.get("/book/:isbn", async (req, res) => {
  const getSpecificPublications = await PublicationModel.findOne({
    books: req.params.isbn,
  });
  // const getSpecificPublications=database.publication.filter((publication)=>publication.books.includes(req.params.isbn))

  if (!getSpecificPublications) {
    return res.json({
      error: `No Publications found for the ISBN of ${req.params.isbn}`,
    });
  }

  return res.json({ Authors: getSpecificPublications });
});

/*
Route         /publication/add
Description   Add new publications
Access        Public
Parameter     None
Methods       POST
*/
Router.post("/add", async (req, res) => {
  try {
    const { newPublication } = req.body;
    await PublicationModel.create(newPublication);
    return res.json({ message: "Publication was added successfully" });
  } catch (error) {
    return res.json({ error: error.message });
  }
});

/*
Route         /publication/update/name/
Description   Update the publication name
Access        Public
Parameter     id
Methods       PUT
*/
Router.put("/update/name/:id", async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.params.id,
    },
    {
      name: req.body.newPublicationName,
    },
    {
      new: true,
    }
  );

  // database.publication.forEach((publication) => {
  //   if (publication.id === parseInt(req.params.id)) {
  //     publication.name = req.body.newPublicationName;
  //     return;
  //   }
  // });

  return res.json({ publication: updatedPublication });
});

/*
Route         /publication/update/book
Description   Update/add books to publications
Access        Public
Parameter     isbn
Methods       PUT
*/
Router.put("/update/book/:isbn", async (req, res) => {
  //Removing the book from previous publication

  const previousPublication = (
    await BookModel.findOne({
      ISBN: req.params.isbn,
    })
  ).publications;
  if (previousPublication !== req.body.pubID) {
    await PublicationModel.findOneAndUpdate(
      {
        id: parseInt(previousPublication),
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
  }
  //update the publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: req.body.pubID,
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

  // database.publication.forEach((publication)=>{
  //     if(publication.id===req.body.pubID){
  //        return publication.books.push(req.params.isbn)
  //     }
  // })

  //update the book database
  const UpdatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      publications: req.body.pubID,
    },
    {
      new: true,
    }
  );
  // database.books.forEach((book)=>{
  //     if(book.ISBN===req.params.isbn){
  //         return book.publications.push(req.body.pubID)

  //     }
  // })
  return res.json({
    books: UpdatedBook,
    publications: updatedPublication,
    message: "Successfully updated publications",
  });
});

/*
Route               /publication/delete
Description         delete an book from a publication
Access              PUBLIC
Parameters          id, isbn
Method              DELETE
*/
Router.delete("/delete/book/:isbn/:pub_id", async (req, res) => {
  //update publication database
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    {
      id: parseInt(req.params.pub_id),
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
  // database.publication.forEach((publication)=>{
  //     if (publication.id===parseInt(req.params.pub_id)){
  //         const newBooksList=publication.books.filter((book)=>book!==req.params.isbn)
  //         publication.books=newBooksList
  //         return;
  //     }

  // })
  //update book database
  const updatedBook = await BookModel.findOneAndUpdate(
    {
      ISBN: req.params.isbn,
    },
    {
      publications: 0, //use pa5rseInt or not both are fine
    },
    {
      new: true,
    }
  );

  // database.books.forEach((book)=>{
  //     if(book.ISBN===req.params.isbn){
  //             const newPublicationsList=book.publications.filter((publication)=>publication!==parseInt(req.params.pub_id))
  //             book.publications=newPublicationsList
  //             return;
  //     }
  // })
  return res.json({ books: updatedBook, publications: updatedPublication });
});

/*
Route -  /publication/delete
Description - Delete a publication
Access-public
Parameter-id
Methods-DELETE
*/
Router.delete("/delete/:id", async (req, res) => {
  const updatePublicationDatabase = await PublicationModel.findOneAndDelete({
    id: req.params.id,
  });
  if (!updatePublicationDatabase) {
    return res.json({ message: "Publication was not found" });
  }
  // const updatePublicationDatabase=database.publication.filter((publication)=>publication.id!==parseInt(req.params.id))
  // database.publication=updatePublicationDatabase;
  return res.json({
    publications: updatePublicationDatabase,
    message: "Publication was deleted successfully",
  });
});

module.exports = Router;
