const express = require('express');
const bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
const app = express();
const crypto = require('crypto-js');
const aes = require('crypto-js/aes');

const dburl = "mongodb://139.59.249.187:27017/ordermng";

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/', function (req, res) {
    res.send('This is OrderMng Restful Webservice ');
})

app.post('/auth', (req, res) => {
    MongoClient.connect(dburl, function (err, db) {
        if (err) throw err;
        console.log("Database connected!");

        var dbo = db.db("ordermng");
        dbo.collection('user')
            .findOne({ username: req.body.username }, (err, result) => {
                var authUser = result;
                if (authUser === null) {
                    res.send("no_user_found")
                }
                else if (authUser.password === req.body.password) {
                    authUser.password = null;
                    res.send(authUser)
                } else {
                    res.send("invalid_password")
                }
            })
    });
})

app.get('/user', (req, res) => {
    MongoClient.connect(dburl, function (err, db) {
        if (err) throw err;
        console.log("Database connected!");

        var dbo = db.db("ordermng");
        dbo.collection('user')
            // .find({}).toArray((err, result) => {
            .find({}, { fields: { password: 0 } }).toArray((err, result) => {
                res.send(result)
            })
    });
})

app.post('/createUser', (req, res) => {
    MongoClient.connect(dburl, function (err, db) {
        if (err) throw err;
        console.log("Database connected!");

        var dbo = db.db("ordermng");

        dbo.collection('user')
            .findOne({ username: req.body.username }, (err, result) => {
                if (result === null) {
                    dbo.collection('user')
                        .insertOne({
                            username: req.body.username,
                            password: req.body.password,
                            branch_number: req.body.branch_number,
                            branch_name: req.body.branch_name,
                            user_name: req.body.user_name,
                            type: req.body.type
                        });
                    res.send("created")
                } else {
                    res.send("duplicate_user")
                }
            })
    });
})

app.post('/updateUser', (req, res) => {
    MongoClient.connect(dburl, function (err, db) {
        if (err) throw err;
        console.log("Database connected!");

        var dbo = db.db("ordermng");
        dbo.collection('user')
            .findOneAndUpdate({ username: req.body.username },
                {
                    $set: {
                        branch_number: req.body.branch_number,
                        branch_name: req.body.branch_name,
                        user_name: req.body.user_name,
                        type: req.body.type
                    }
                },
                (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                });
    });
})

app.post('/deleteUser', (req, res) => {
    MongoClient.connect(dburl, function (err, db) {
        if (err) throw err;
        console.log("Database connected!");

        var dbo = db.db("ordermng");
        dbo.collection('user')
            .findOneAndDelete({ username: req.body.username },
                (err, result) => {
                    if (err) return res.send(err)
                    res.send(result)
                });
    });
})




var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Restful Webservice listening at http://%s:%s", host, port)
})