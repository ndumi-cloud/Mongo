const express = require('express')
const { connectToDb, getDb } = require('./db')
const { ObjectId } = require('mongodb'); // Import ObjectId from mongodb

// init app &middleware
const app = express()
app.use(express.json())

// db connection
let db

connectToDb((err) => {
    if (!err) {
        app.listen(3000, ()=> {
            console.log('app listening on port 3000')
        }) 
        db = getDb()
    }
})



// routes

app.get('/books', (req, res) => {
        const page = req.query.p || 0
        const booksPerPage = 3
   
        // .find() cursor toArray - fetches all of the documents that the cursor points to and puts them into an array
        // forEach - iterates the document one at a time and allows us to process each one individually
        let books = []
        db.collection('books')

        .find()
        .sort({author: 1})
        .skip(page * booksPerPage)
        .limit(booksPerPage)
        .forEach(book =>books.push(book) )
        .then(() => {
            res.status(200).json(books)
        })
        .catch (() => {
            res.status(500).json({error: 'Could not fetch the documents'})
        })

    
})
app.get('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
    .findOne({_id: new ObjectId(req.params.id)})
    .then(doc => {
        res.status(200).json(doc)
    })
    .catch(err => {
        res.status(500).json({error: "Could not fetch the documents"})
    })
    } else {
        res.status(500).json({error: 'Not a valid document id'})
    }
    

    
})

app.post('/books', (req,res) => {
    const book = req.body

    db.collection('books')
        .insertOne(book)
        .then(result => {
            res.status(201).json(result)
        })
        .catch(err => {
            res.status(500).json({err: 'Could not create a new document'})
        })
})

app.delete('/books/:id', (req, res) => {
    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
    .deleteOne({_id: new ObjectId(req.params.id)})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({error: "Could not delete the documents"})
    })
    } else {
        res.status(500).json({error: 'Not a valid document id'})
    }
})

// PATCH REQUESTS

app.patch('/books/:id', (req, res) =>{
    const updates = req.body

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
    .updateOne({_id: new ObjectId(req.params.id)}, {$set: updates})
    .then(result => {
        res.status(200).json(result)
    })
    .catch(err => {
        res.status(500).json({error: "Could not update the documents"})
    })
    } else {
        res.status(500).json({error: 'Not a valid document id'})
    }
    
})
