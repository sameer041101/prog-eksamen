var createError = require('http-errors');
const express = require('express'); // Include ExpressJS
const session = require('express-session');
var cookieSession = require('cookie-session')
const bodyParser = require('body-parser'); // Middleware
const fs = require('fs-extra')
const path = require('path');
const http = require('http');
const multer = require("multer");

var alert = require('alert');

const app = express(); // Create an ExpressJS app

const oneDay = 1000 * 60 * 60 * 24;

const upload = multer({
  dest: __dirname+"images"
});

app.use(cookieSession({
  name: 'session',
  keys: ['key'],

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
app.get('/image', (req, res) => {
  res.sendFile(__dirname + '/hus.jpeg');
});
app.get('/image1', (req, res) => {
  res.sendFile(__dirname + '/tøj.jpeg');
});
// Route to Homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/eksamen.html');
});

// Route to scripts
app.get('/items', (req, res) => {
  res.sendFile(__dirname + '/home/items.js');
});
app.get('/itemskat', (req, res) => {
  res.sendFile(__dirname + '/home/itemskat.js');
});
app.get('/getuser', (req, res) => {
  res.sendFile(__dirname + '/home/getuser.js');
});

// Route to json
app.get('/varer', (req, res) => {
  res.sendFile(__dirname + '/varer.json');
});
app.get('/userjson', (req, res) => {
  res.sendFile(__dirname + '/user.json');
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
    req.session.user = userEmail;
    res.redirect("/home")
  }
});

// log ud
app.get('/logud', (req, res) => {
  req.session = null
  res.redirect("/")
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
      req.session.user= userEmail;
      res.redirect("/home")
    }
    
    
    }
    else{
      alert("password ikke ens")
      res.redirect("/signup")
    }
  });


// Route to home
app.get('/home', (req, res) => {
  if(req.session.loggedin){
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Set-Cookie', ['user='+req.session.user]);
    res.sendFile(__dirname+'/home/');
  }else{
    res.redirect("/")
  }
});

// Route user page
app.get('/user', (req, res) => {
  if(req.session.loggedin){
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Set-Cookie', ['user='+req.session.user]);
    res.sendFile(__dirname+'/home/user.html');
  }else{
    res.redirect("/")
  }
});

// Route edit user pages
app.get('/userup', (req, res) => {
  if(req.session.loggedin){
    res.sendFile(__dirname+'/home/userup.html');
  }else{
    res.redirect("/")
  }
});

app.get('/editemail', (req, res) => {
  if(req.session.loggedin){
    res.sendFile(__dirname+'/home/editemail.html');
  }else{
    res.redirect("/")
  }
});

app.post('/editemail', async (req, res) => {
  if(req.session.loggedin){
    let userEmail = req.body.email;
    const path = './user.json';
    
   

    async function readJsonFile (f, userEmail) {
      const obj = await fs.readJSON(f, { throws: false })
      console.log(obj) // => null
      // create array for users
      var users = []

      // Check if file is empty and if not empty check if email is taken
      if(obj != null){ // If file not empty 
        // read in all usres to users
        for (var key in obj){

          if(obj[key]["user"]["email"] == userEmail){
            return "EIU"
          }else{
            for (var key in obj){

              if(obj[key]["user"]["email"] == req.session.user){
                // push the updated user to users
                var user = {};
                
                user["user"] = {"email": userEmail,"name": obj[key]["user"]["name"],"password":obj[key]["user"]["password"]};

                users.push(user)

              }else{

                
                var user = {};
                user["user"] = obj[key]["user"];

                users.push(user)
              }
            }
          }
        }
        
        // write usres to users.json
        writeJsonFile(path, users)
        return JSON.stringify(users)
    
      }
    }
    var file = await readJsonFile(path, userEmail)
    if (file == "EIU"){
      alert("Email is used")
      res.redirect("/user")
    }else{
      req.session.user= userEmail;
      res.setHeader('Content-Type', 'text/html');
      res.setHeader('Set-Cookie', ['user='+req.session.user]);
      res.redirect('/userup');
    }
  }else{
    res.redirect("/")
  }
});

app.get('/editname', (req, res) => {
  if(req.session.loggedin){
    res.sendFile(__dirname+'/home/editname.html');
  }else{
    res.redirect("/")
  }
});

app.post('/editname', async (req, res) => {
  if(req.session.loggedin){
    let userName = req.body.name;
    const path = './user.json';
    
   

    async function readJsonFile (f, userName) {
      const obj = await fs.readJSON(f, { throws: false })
      console.log(obj) // => null
      // create array for users
      var users = []

      // Check if file is empty and if not empty check if email is taken
      if(obj != null){ // If file not empty 
        // read in all usres to users
        for (var key in obj){

          if(obj[key]["user"]["email"] == req.session.user){
            // push the updated user to users
            var user = {};
            
            user["user"] = {"email": obj[key]["user"]["email"],"name": userName,"password":obj[key]["user"]["password"]};

            users.push(user)

          }else{

          
          var user = {};
          user["user"] = obj[key]["user"];

          users.push(user)
            }
          }
        }
        
        // write usres to users.json
        writeJsonFile(path, users)
        return JSON.stringify(users)
      
      
    }
    var file = await readJsonFile(path, userName)
    if(file){
      res.redirect('/userup');
    }else{
      res.send("Something went wrong")
    }
  }else{
    res.redirect("/")
  }
});

app.get('/editpas', (req, res) => {
  if(req.session.loggedin){
    res.sendFile(__dirname+'/home/editpas.html');
  }else{
    res.redirect("/")
  }
});

app.post('/editpas', async (req, res) => {
  if(req.session.loggedin){
    let userPassword = req.body.psw;
    let pswRepeat = req.body.pswRepeat;
    const path = './user.json';
    
   

    async function readJsonFile (f, userPassword) {
      const obj = await fs.readJSON(f, { throws: false })
      console.log(obj) // => null
      // create array for users
      var users = []

      // Check if file is empty and if not empty check if email is taken
      if(obj != null){ // If file not empty 
        // read in all usres to users
        for (var key in obj){

          if(obj[key]["user"]["email"] == req.session.user){
            // push the updated user to users
            var user = {};
            
            user["user"] = {"email": obj[key]["user"]["email"],"name": obj[key]["user"]["name"],"password":userPassword};

            users.push(user)

          }else{

          
          var user = {};
          user["user"] = obj[key]["user"];

          users.push(user)
            }
          }
        }
        
        // write usres to users.json
        writeJsonFile(path, users)
        return JSON.stringify(users)
      
      
    }

    if(userPassword == pswRepeat){
      var file = await readJsonFile(path, userPassword)
    
      if(file){
        res.redirect('/userup');
      }else{
        res.send("Something went wrong")
      }
    }else{
      alert("password ikke ens")
      res.redirect("/editpas")
    }
  }else{
    res.redirect("/")
  }
});

app.get('/deleteuser', (req, res) => {
  if(req.session.loggedin){
    res.sendFile(__dirname+'/home/deleteuser.html');
  }else{
    res.redirect("/")
  }
});

app.post('/deleteuser', async (req, res) => {
  if(req.session.loggedin){
    const path = './user.json';
    
   

    async function readJsonFile (f) {
      const obj = await fs.readJSON(f, { throws: false })
      console.log(obj) // => null
      // create array for users
      var users = []

      // Check if file is empty and if not empty check if email is taken
      if(obj != null){ // If file not empty 
        // read in all usres to users
        for (var key in obj){

          if(obj[key]["user"]["email"] != req.session.user){
          
          var user = {};
          user["user"] = obj[key]["user"];

          users.push(user)
            }
          }
        }
        
        // write usres to users.json
        writeJsonFile(path, users)
        return JSON.stringify(users)
      
      
    }


      var file = await readJsonFile(path)
    
      if(file){
        res.redirect('/');
      }else{
        res.send("Something went wrong")
      }

  }else{
    res.redirect("/")
  }
});

// Route my items page
app.get('/myitems', (req, res) => {
  if(req.session.loggedin){
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Set-Cookie', ['user='+req.session.user]);
    res.sendFile(__dirname+'/home/myitems.html');
  }else{
    res.redirect("/")
  }
});


// Route add item page
app.get('/add', (req, res) => {
  if(req.session.loggedin){
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Set-Cookie', ['user='+req.session.user]);
    res.sendFile(__dirname+'/home/additem.html');
  }else{
    res.redirect("/")
  }
});

app.post('/add', async (req, res) => {

  let katagori = req.body.kat;
  let pris = req.body.pris;
  let img = req.body.img;
  
  const path = './varer.json';
  
 

  async function readJsonFile (f, katagori, pris, img) {
    const obj = await fs.readJSON(f, { throws: false })
    console.log(obj) // => null
    // create array for varere
    var varers = []

    if(obj != null){ // If file not empty 
      // read in all varer to varers
      for (var key in obj){

        var varer = {};
        varer["varer"] = obj[key]["varer"];

        varers.push(varer)
        }
      }
      // push the new varer to varers
      var key = "varer";
      var varer = {};
      
      varer[key] = {"kat": katagori,"pris":pris, "user": req.session.user};

      varers.push(varer)

      // write usres to users.json
      writeJsonFile(path, varers)
      return JSON.stringify(varers)
    
    
  }
  var file = await readJsonFile(path, katagori, pris)
  
  
  res.redirect("/myitems")
  
  
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

