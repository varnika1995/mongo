const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser')

const url = 'mongodb://localhost:27017/edx-course-db'

let app = express()

app.use(logger('dev'))
app.use(bodyParser.json())

const client = new MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
    const db = client.db("edx-course-db");
    // perform actions on the collection object
    if (err) return process.exit(1)

    console.log('Connected');

    app.get('/accounts', (req, res, next) => {
        db.collection('accounts')
            .find({}, { sort: { _id: -1 } })
            .toArray((error, accounts) => {
                if (error) return next(error)
            })
    })

    app.post('/accounts', (req, res, next) => {
        let newAccount = req.body
        db.collection('accounts').insert(newAccount, (error, results) => {
            if (error) return next(error)
            res.send(results)
        })
    })

    app.put('/accounts/:id', (req, res) => {
        db.collection('accounts')
            .update({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.body }, (error, result) => {

                if (error) return next(error)
                res.send(results)
            })
    })


    app.delete('/accounts/:id', (req, res) => {
        db.collection('accounts').remove({ _id: mongodb.ObjectID(req.param) }, (error, result) => {
            if (error) return next(error)
            res.send(results)
        })
    })

    app.use(errorhandler())
    app.listen(3000)
})