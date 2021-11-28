var createError = require('http-errors');
const express = require('express'); // Include ExpressJS
const app = express(); // Create an ExpressJS app
const bodyParser = require('body-parser'); // Middleware

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
    }
    res.send(`
            Username: ${username} <br> 
            Password: ${password} <br>
            Password-repeated: ${passwordRepeat} <br>
            Is password equal: ${passwordEqual} <br>
            Rember: ${remember}
    `);
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

