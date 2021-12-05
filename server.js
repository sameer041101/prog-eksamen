var createError = require('http-errors');
const express = require('express'); // Include ExpressJS
const session = require('express-session');
var cookieSession = require('cookie-session')
const bodyParser = require('body-parser'); // Middleware
const fs = require('fs-extra')
const path = require('path');

var alert = require('alert');

const app = express(); // Create an ExpressJS app

const oneDay = 1000 * 60 * 60 * 24;
// app.use(session({
//   secret: 'secret',
//   resave: true,
//   saveUninitialized: true,
//   secure:false,
// }))

app.use(cookieSession({
  name: 'session',
  keys: ['secret'],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(bodyParser.urlencoded({ extended: false }));


async function writeJsonFile (path, file) { // write json to a file
  try {
    await fs.writeJson(path, file); 
    console.log('success!')
    
  } catch (err) {
    console.error(err)
  }
}


// Route to css
app.get('/logincss', (req, res) => {
    res.sendFile(__dirname + '/login metode/login.css');
  });
app.get('/eksamencss', (req, res) => {
  res.sendFile(__dirname + '/eksamen.css');
});
app.get('/homecss', (req, res) => {
  res.sendFile(__dirname + '/home/home.css');
});

// Route to Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/eksamen.html');
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login metode/login.html');
});

// Log in
app.post('/login', async (req, res) => {

  let userEmail = req.body.username;
  let password = req.body.password;

  async function readJsonFile (f, userEmail, password) {
    const obj = await fs.readJSON(f, { throws: false })
    console.log(obj) // => null

    // Check if file is empty and if not empty check if email is taken
    if(obj != null){ // If file not empty
      // read in all usres to users
      for (var key in obj){

        if(obj[key]["user"]["email"] == userEmail && obj[key]["user"]["password"] == password){
          return true // login true
        }
        }
      }
      
      return false // login false
    
  }
  const path = './user.json';
  var login = await readJsonFile(path, userEmail, password)
  if (login == false){
    alert("Email eller kodeord er forkert")
    res.redirect("/login")
  }else{
    req.session.loggedin = true;
    res.redirect("/home")
  }
});

// log ud
app.get('/logud', (req, res) => {
  req.session = null
  res.redirect("/")
});

// Route to home
app.get('/home', (req, res) => {
  if(req.session.loggedin){
    res.sendFile(__dirname+'/home/');
  }else{
    res.redirect("/")
  }

  
});

// Route to SignUp Page
app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/login metode/signup.html');
  });
  
  app.post('/signup', async (req, res) => {
    // Insert Login Code Here
    let username = req.body.Name;
    let userEmail = req.body.email;
    let password = req.body.psw;
    let passwordRepeat = req.body.pswRepeat;
    let remember = req.body.remember;

    let passwordEqual = false;
    if (password == passwordRepeat) {
        passwordEqual = true;
    
    const path = './user.json';
    
   

    async function readJsonFile (f, userEmail, username, password) {
      const obj = await fs.readJSON(f, { throws: false })
      console.log(obj) // => null
      // create array for users
      var users = []

      // Check if file is empty and if not empty check if email is taken
      if(obj != null){ // If file not empty 
        // read in all usres to users
        for (var key in obj){

          if(obj[key]["user"]["email"] == userEmail){
            return "EIU" // Return email is useds
          }
          var user = {};
          user["user"] = obj[key]["user"];

        users.push(user)
          }
        }
        // push the new user to users
        var key = "user";
        var user = {};
        
        user[key] = {"email": userEmail,"name":username,"password":password};

        users.push(user)

        // write usres to users.json
        writeJsonFile(path, users)
        return JSON.stringify(users)
      
      
    }
    var file = await readJsonFile(path, userEmail, username, password)
    
    
    if (file == "EIU"){
      alert("Email is used")
      res.redirect("/signup")
    }else{
      req.session.loggedin = true;
      res.redirect("/home")
    }
    
    
    }
    else{
      res.send(`Password ikke ens`)
      res.end()
    }
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

