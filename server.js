var createError = require('http-errors');
const express = require('express'); // Include ExpressJS
const session = require('express-session');
const bodyParser = require('body-parser'); // Middleware
const fs = require('fs');
const path = require('path');
const { use } = require('passport');

const app = express(); // Create an ExpressJS app
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: false }));

// Route to css
app.get('/logincss', (req, res) => {
    res.sendFile(__dirname + '/login metode/login.css');
  });
app.get('/eksamencss', (req, res) => {
  res.sendFile(__dirname + '/eksamen.css');
});

// Route to Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/eksamen.html');
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login metode/login.html');
});

app.post('/login', (req, res) => {
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`);
});

// Route to home
app.get('/home', (req, res) => {
  if(req.session.loggedin){
    res.sendFile(__dirname + '/home.html');
  }else{
    res.redirect("/")
  }
  
});

// Route to jsonfile
app.get('/json', (req, res) => {
  res.sendFile(__dirname + '/json.txt');
});

// Route to SignUp Page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/login metode/signup.html');
  });
  
  app.post('/signup', (req, res) => {
    // Insert Login Code Here
    let username = req.body.Name;
    let password = req.body.psw;
    let passwordRepeat = req.body.pswRepeat;
    let remember = req.body.remember;

    let passwordEqual = false;
    if (password == passwordRepeat) {
        passwordEqual = true;
    
      var data = {
        username: username,
        password: password
      }

      json = JSON.stringify({data})
      file = fs.readFileSync("./json.json");
        let obj = JSON.parse(data);
        console.log(obj)

      res.send("hej")
      var hasMatch = false;

      // for(i=0; i < JSON.parse(file).length; i++) {
      //   var data = file[i]
      //   console.log(data)
      // }



        
      // }
      // else{
      //   res.send("findes")
      // }
      // fs.writeFileSync('./json.txt', json+file, function(err, result) {
      //   if(err) console.log('error', err);
      // });
      

      // req.session.loggedin = true
      // res.redirect("/home")
    }
    else{
      res.send(`Password ikke ens`)
    }
    // res.send(`
    //         Username: ${username} <br> 
    //         Password: ${password} <br>
    //         Password-repeated: ${passwordRepeat} <br>
    //         Is password equal: ${passwordEqual} <br>
    //         Rember: ${remember}
    // `);
  });

// Route to 404 image
app.get('/404', (req, res) => {
    res.sendFile(__dirname + '/error/404.jpeg');
  });

// catch 404 and forward to error handler
app.get('*', function(req, res){
    res.status(404).sendFile(__dirname + '/error/404.html');
  });
const port = 3000 // Port we will listen on

// Function to listen on the port
app.listen(port, () => console.log(`This app is listening on port ${port}`));

