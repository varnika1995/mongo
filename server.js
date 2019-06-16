const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const mongodb = require('mongodb')
const bodyParser = require('body-parser')
const cors=require('cors')
const path=require('path')

const MongoClient = require('MongoDB').MongoClient
const assert = require('assert');
const url = 'mongodb://localhost:27017';
const dbName = 'myproject1';
const client = new MongoClient(url);

let app = express()

app.use(cors())

app.use(express.urlencoded({extended:true}));
app.use(logger('dev'))
app.use(bodyParser.json())

app.get('/index.html',(req,res)=>{
    console.log(__dirname)
    res.sendFile(path.join(__dirname,'index.html'))
})

client.connect((error) => {
    try{

    if (error) return process.exit(1)
    console.log('sucessful');
    const db = client.db(dbName);
    console.log("Connect executed");


app.get('/accounts', (req, res) => {
    db.collection('accounts')
        .find({}, { sort: { _id: -1 } })
        .toArray((error, accounts) => {
            if (error) return next(error)
            res.send(accounts)
            client.close();
        })
})

app.post('/accounts', (req, res,next) => {
    let newAccount = req.body
    db.collection('accounts').insert(newAccount, (error, results) => {
        console.log("Post executed");
        if (error) return next(error)
        res.send(results)
        client.close();
    })
})


app.put('/accounts/:id', (req, res, next) => {
    
    db.collection('accounts')
       // let id=req.query.id
        .update({ _id: mongodb.ObjectID(req.params.id) },
            { $set: req.body},
            (error, results) => {
                if (error) return next(error)
                res.send(results)
                client.close();
            }
        )
})

app.delete('/accounts/:id', (req, res, next) => {
    db.collection('accounts')
        .remove({ _id: mongodb.ObjectID(req.params.id) }, (error, results) => {
            if (error) return next(error)
            res.send(results)
            client.close();
        })
})
    }
    catch(err)
    {
        console.error(err);
    }

})
app.use(errorhandler())
app.listen(4000)


/*const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')

const MongoClient = require('mongodb').MongoClient
const assert = require('assert');

const url = 'mongodb://localhost:27017';



const dbName = 'myproject1';
const client = new MongoClient(url);

let app = express()

app.use(express.urlencoded({extended:true}));
app.use(logger('dev'))
app.use(bodyParser.json())


client.connect((err)=> {
    assert.equal(null, err);
    console.log("Connected successfully to server");
  
    const db = client.db(dbName);
  
    
  

//mongodb.MongoClient.connect(url, (error, db) => {
  //  if (error) return process.exit(1)

   
})


app.get('/accounts', (req, res) => {
    db.collection('accounts')
        .find({}, { sort: { _id: -1 } })
        .toArray((error, accounts) => {
            if (error) return next(error)
            client.close();
            
        })
})

app.post('/accounts', (req, res) => {
    let newAccount = req.body
    db.collection('demo').insert(newAccount, (error, results) => {
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
            client.close();
        })
})


app.delete('/accounts/:id', (req, res) => {
    db.collection('accounts').remove({ _id: mongodb.ObjectID(req.param.id) }, (error, result) => {
        if (error) return next(error)
        res.send(results)
        client.close();
    })
    
})

app.use(errorhandler())
app.listen(4000)

*/