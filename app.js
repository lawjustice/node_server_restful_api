const express = require('express');
const app = express();
const router = express.Router();
const port = 4000;
const pg = require('pg');
const config = {
    user: 'postgres',
    database: 'mini_project', 
    password: 'postgre', 
    port: 5432, 
    max: 10, // max number of connection can be open to database
    idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  };
const pool = new pg.Pool(config);
// const db = require('./db')

// url: http://localhost:4000/
// app.get('/', (request, response) => response.send('Hello World!!'));
app.get('/', (request, response) =>
{
    db.query('SELECT * FROM sscuser WHERE id = $1', [1], (err, res) => {
      if (err) {
        return next(err)
      }
      res.send(res.rows[0])
    })
  })

// all routes prefixed with /api
app.use('/api', router);

// this array is used for identification of allowed origins in CORS
const originWhitelist = ['http://localhost:4000', 'https://example.net'];

// middleware route that all requests pass through
router.use((request, response, next) => {
  console.log('Server info: Request received');
  
  let origin = request.headers.origin;
  
  // only allow requests from origins that we trust
  if (originWhitelist.indexOf(origin) > -1) {
    response.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // only allow get requests, separate methods by comma e.g. 'GET, POST'
  response.setHeader('Access-Control-Allow-Methods', 'GET');
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  response.setHeader('Access-Control-Allow-Credentials', true);
  
  // push through to the proper route
  next();
});

// using router.get() to prefix our path
// url: http://localhost:4000/api/
router.get('/', (request, response) => {
  response.json({message: 'Hello, welcome to my server!!'});
});

  // all of the code from the previous section should be here
  const url = require('url');

  router.get('/stuff', (request, response) => {
    var urlParts = url.parse(request.url, true);
    var parameters = urlParts.query;
    var myParam = parameters.myParam;
    // e.g. myVenues = 12;
    
    var myResponse = `I multiplied the number you gave me (${myParam}) by 5 and got: ${myParam * 5}`;
    
    response.json({message: myResponse});
  });

  router.get('/users', function (req, res, next) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
    //    client.query('SELECT * FROM sscuser where id = $1', [1],function(err,result) {
        client.query('SELECT * FROM sscuser where userid = $1', [1],function(err,result) {
           done(); // closing the connection;
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

router.get('/pool', function (req, res) {
    pool.connect(function(err,client,done) {
       if(err){
           console.log("not able to get connection "+ err);
           res.status(400).send(err);
       } 
       client.query('SELECT * from sscuser' ,function(err,result) {
          //call `done()` to release the client back to the pool
           done(); 
           if(err){
               console.log(err);
               res.status(400).send(err);
           }
           res.status(200).send(result.rows);
       });
    });
});

// set the server to listen on port 4000
app.listen(port, () => console.log(`Listening on port ${port}`));

