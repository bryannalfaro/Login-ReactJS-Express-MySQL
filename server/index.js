const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const saltRounds = 10;

const app = express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
})); // enable cors
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({key:'userID',secret: "secret", resave: false, saveUninitialized: false,cookie:{
    expires: 60 * 60 * 24
}}));

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "0213",
  database: "usuarios",
});

app.get('/login', (req, res) => {
    if(req.session.user){
        res.send({loggedIn:true, user:req.session.user});
    }else{
        res.send({loggedIn:false});
    }
})

app.post('/register', function(req, res) {
  const { name, password } = req.body;
  bcrypt.hash(password,saltRounds,function(err,hash){

    if(err){
      console.log(err);
    }

    db.query(`INSERT INTO user (name, password) VALUES ('${name}','${hash}')`, function(error, results) {
      if (error) throw error;
      res.send(results);
    });

  })

})

app.post('/login', function(req, res) {
  const { name, password } = req.body;
  db.query(`SELECT * FROM user WHERE name = '${name}'`, function(error, results) {
    if (error) throw error;
    if(results.length > 0){
      bcrypt.compare(password, results[0].password, function(err, result) {
        if(result){
          req.session.user = results
          console.log(req.session.user);
          res.send(results);
        }else{
          res.send({message:"error, user or password incorrect"});
        }
      })
    }else{
      res.send({message: 'user does not exist'});
    }
  });
})

app.listen(3001, () => {
  console.log("running server");
});
