const http = require('http');
const dotenv = require("dotenv");
dotenv.config();

const path = require('path'); 
const express = require('express');
const app = express();
const db = require('./database');
const bcrypt = require("bcrypt");
const openai_api = require("openai");
const openai = new openai_api({
  apiKey: process.env.OPENAI_API_KEY,
});

// index.js - Simple Node.js HTTP server

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));

app.use(express.json());


const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '3000', 10);

// Hashing
const hashPassword = async (plainPassword) => {
  const saltRounds = 10; // higher = more secure, but slower
  const hash = await bcrypt.hash(plainPassword, saltRounds);
  return hash;
};

// Comparing
const checkPassword = async (plainPassword, hash) => {
  return await bcrypt.compare(plainPassword, hash);
};


// const server = http.createServer((req, res) => {
//     // Basic routing
//     if (req.url === '/health') {
//         res.writeHead(200, { 'Content-Type': 'application/json' });
//         res.end(JSON.stringify({ status: 'ok' }));
//         return;
//     }

//     // Default response
//     res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
//     res.end('Hello from Node.js!\n');
// });

app.get('/cars', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public/cars.html')); // serve cars.html

})

app.get('/signup_page', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public/signup.html')); // serve signup.html
})

app.get('/login_page', (req, res) =>{
    res.sendFile(path.join(__dirname, 'public/login.html')); // serve login.html
})



app.get('/account', (req, res) =>{
  res.sendFile(path.join(__dirname, 'public/html/account.html')); // serve account.html
})

app.post('/account/change-email', (req, res) =>{
  return res.status(501).send("Not Implemented");
  ;// Update Firebase
})

app.post('/account/change-password', (req, res) =>{
  return res.status(501).send("Not Implemented");
  ;// Update Firebase
})



app.get('/cars/1', (req, res) =>{
  res.sendFile(path.join(__dirname, 'public/html/car-page.html')); // serve car-page.html. Will need to pull data fields from a database or API
})

app.post('/cars/1/note', (req, res) =>{
  return res.status(501).send("Not Implemented");
  ;// Save the note to database for this car ID
})

app.post('/cars/1/ai-chat', (req, res) =>{
  return res.status(501).send("Not Implemented");
  ;// Implement ChatGPT API
})


app.post('/signup', async (req, res) =>{
  
  const { username, email, password } = req.body;
  try{
    passwordHash = await hashPassword(password);
  } catch (err) {
    console.error("Error hashing password", err);
    return res.status(500).send("Internal server error");
  }

  // Save user to Firestore
  async function saveUser() {
    try {
      const docRef = await db.collection('users').add({
        username,
        email,
        passwordHash,
      createdAt: new Date()
      });
      console.log('User added with ID: ', docRef.id);
      res.send('Signup successful!');
    } catch (e) {
      console.error('Error adding user: ', e);
      res.status(500).send('Error signing up');
    }
  }

  saveUser();

})

app.post('/login', (req, res) =>{
  const { email, password } = req.body;
  
  // Fetch user from Firestore
  async function fetchUser(email, password, res) {
    try {
      const usersRef = db.collection('users');
      const snapshot = await usersRef.where('email', '==', email).get();
      if (snapshot.empty) {
        console.log('No matching user.');
        return res.status(400).send('Invalid email or password');
      }

      let userData;
      snapshot.forEach(doc => {
        userData = doc.data();
      });
      
      const passwordMatch = await checkPassword(password, userData.passwordHash);
      if (passwordMatch) {
        res.send('Login successful!');
      } else {
        res.status(400).send('Invalid email or password');
      }
    } catch (e) {
      console.error('Error fetching user: ', e);
      res.status(500).send('Error logging in');
    }
  }

  fetchUser(email, password, res);
})


// Proxy endpoint for CarQuery
app.get('/api/makes', async (req, res) => {
  try {
    const response = await fetch('https://www.carqueryapi.com/api/0.3/?cmd=getMakes&sold_in_us=1');
    const text = await response.text();
    res.send(text); // send raw CarQuery data to frontend
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get models for a given make
app.get('/api/models', async (req, res) => {
  const make = req.query.make; // frontend will send ?make=ford
  if (!make) return res.status(400).send('Missing make');

  try {
    const response = await fetch(`https://www.carqueryapi.com/api/0.3/?cmd=getModels&make=${make}`);
    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get trims/info for a make & model
app.get('/api/trims', async (req, res) => {
  const { make, model } = req.query;
  if (!make || !model) return res.status(400).send('Missing make or model');

  try {
    const response = await fetch(`https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=${make}&model=${model}`);
    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/ai', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public/html/gpt-test.html'))
});

app.post('/ai_processor', async (req, res) => {
    console.log(req.body.prompt);
    const response = await openai.responses.create({
        model: "gpt-5-nano",
        input: req.body.prompt,
        store: true,
        // max_output_tokens: 300,
    });
    let gpt_output = response.output_text;
    console.log(response);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({gpt_response: gpt_output}));
});

app.listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
});

// // Graceful shutdown
// const shutdown = (signal) => {
//     console.log(`Received ${signal}. Shutting down...`);
//     app.close((err) => {
//         if (err) {
//             console.error('Error during shutdown:', err);
//             process.exit(1);
//         }
//         process.exit(0);
//     });
// };

// process.on('SIGINT', () => shutdown('SIGINT'));
// process.on('SIGTERM', () => shutdown('SIGTERM'));