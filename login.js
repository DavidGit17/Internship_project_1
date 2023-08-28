// // This function is called when the user clicks the "Login" button.
// function login() {
//     // Get the username and password from the form.
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;
  
//     // Make a POST request to the /login endpoint.
//     fetch("/login", {
//       method: "POST",
//       body: JSON.stringify({ username, password }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data.success) {
//           // The login was successful. Redirect the user to the home page.
//           window.location.href = "/";
//         } else {
//           // The login was unsuccessful. Show an error message.
//           alert(data.error);
//         }
//       })
//       .catch(error => {
//         // An error occurred. Show an error message.
//         alert(error);
//       });
//   }
  
//   // This function is called when the user clicks the "Register" button.
//   function register() {
//     // Get the username, password, and email from the form.
//     const username = document.getElementById("username").value;
//     const password = document.getElementById("password").value;
//     const email = document.getElementById("email").value;
  
//     // Make a POST request to the /register endpoint.
//     fetch("/register", {
//       method: "POST",
//       body: JSON.stringify({ username, password, email }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         if (data.success) {
//           // The registration was successful. Show a success message.
//           alert(data.message);
//         } else {
//           // The registration was unsuccessful. Show an error message.
//           alert(data.error);
//         }
//       })
//       .catch(error => {
//         // An error occurred. Show an error message.
//         alert(error);
//       });
//   }
  

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb+srv://dave172004:xB1JrFg8EKY2OyOI@cluster0.pcvv2uy.mongodb.net/sample_airbnb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;

// User Schema
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

// Routes
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/public/index.html');
// });

app.get('/',(req,res)=>{
    res.json({"message" : "hello world"})
})

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    
    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = new User({
        username: username,
        password: hashedPassword
    });
    
    newUser.save(err => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.redirect('/login');
        }
    });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    
    // Find the user by username
    const user = await User.findOne({ username: username });
    
    if (user) {
        // Compare the entered password with the hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            res.send('Login successful!');
        } else {
            res.send('Incorrect password.');
        }
    } else {
        res.send('User not found.');
    }
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
