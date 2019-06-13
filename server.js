const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')


const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = 'mongodb://localhost:27017/myproject';

const dbName = 'myproject';
const client = new MongoClient(url);

let app = express()

app.use(logger('dev'))
app.use(bodyParser.json())


client.connect(url,(error,db)=> {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
  
    
  

//mongodb.MongoClient.connect(url, (error, db) => {
  //  if (error) return process.exit(1)

    app.get('/accounts', (req, res, next) => {
        db.collection('accounts')
            .find({}, { sort: { _id: -1 } })
            .toArray((error, accounts) => {
                if (error) return next(error)
                client.close();
            })

    })

    app.post('/accounts', (req, res, next) => {
        let newAccount = req.body
        db.collection('accounts').insert(newAccount, (error, results) => {
            if (error) return next(error)
            res.send(results)
            client.close();
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
        db.collection('accounts').remove({ _id: mongodb.ObjectID(req.param.id) }, (error, result) => {
            if (error) return next(error)
            res.send(results)
        })
    })
    console.log(db)
    
    app.use(errorhandler())
    app.listen(3000)
})