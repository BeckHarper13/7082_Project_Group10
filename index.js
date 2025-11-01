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
const session = require('express-session');


const fetchsuser = require('./FetchUserInfo');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public/html'));



app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/landing-page.html'))
})

app.get('/search', (req, res) => {
  const userId = req.session.username ? req.session.userId : null;
  if (!userId) {
    return res.status(401).redirect("/");
  }

  res.render("search-cars");
})

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/signup.html')); // serve signup.html
})

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/html/login.html')); // serve login.html
})

app.get('/home', (req, res) => {
  const userId = req.session.username ? req.session.userId : null;
  if (!userId) {
    return res.status(401).redirect("/");
  }

  console.log('Fetching account for user: ', req.session.username);
  const username = req.session.username;

  fetchsuser.getUserandCars(username)
    .then(data => {
      res.render('home', {
        username: data.user.username,
        cars: data.cars
      });
    })
    .catch(err => {
      console.error('Error fetching user and cars: ', err);
      res.status(500).send("Internal Server Error");
    });
})

app.get('/account', (req, res) => {
  const userId = req.session.username ? req.session.userId : null;
  if (!userId) {
    return res.status(401).redirect("/");
  }

  console.log('Fetching account for user: ', req.session.username);
  const username = req.session.username;

  fetchsuser.getUserandCars(username)
    .then(data => {
      res.render('account', {
        username: data.user.username,
        email_address: data.user.email,
        cars: data.cars
      });
    })
    .catch(err => {
      console.error('Error fetching user and cars: ', err);
      res.status(500).send("Internal Server Error");
    });
})

app.post('/account/change-email', (req, res) => {
  return res.status(501).send("Not Implemented");
  ;// Update Firebase
})

app.post('/account/change-password', (req, res) => {
  return res.status(501).send("Not Implemented");
  ;// Update Firebase
})



app.get('/car/:carId', (req, res) => {
  const userId = req.session.username ? req.session.userId : null;
  if (!userId) {
    return res.status(401).redirect("/");
  }

  const carId = req.params.carId; 

  // const carData = db.getCarById(carId); 
  
  // Sample data
  const carData = {
    car_id: carId, 
    car_name: "Mustang EcoBoost Premium 2dr Coupe (2.3L 4cyl Turbo 6M) (2017)",
    license_plate: "SGT-2025",
    car_image_url: "https://www.ford.ca/cmslibs/content/dam/na/ford/en_ca/images/mustang/2026/jellybeans/26_frd_mst_eb_ps34_rcrd.png", 
    vin: "1HGCM3B19GA000000",
    make: "Ford",
    model: "Mustang",
    manufacture_year: 2025,
    fuel_fill: 85,
    fuel_type: "Premium Unleaded",
    fuel_efficiency: 12.4, 
    tire_fl_pressure: 34,
    tire_fr_pressure: 34,
    tire_rl_pressure: 36,
    tire_rr_pressure: 36,
    tire_tread_depth: 7.2, 
    oil_life: 68,
    coolant_temp: 92, 
    transmission_fluid: "OK",
    battery_voltage: 12.6, 
    odometer: 14520, 
    trip_distance: 285.5, 
    avg_speed: 62, 
    top_speed: 185, 
    notes: "Next service due at 20,000km."
  };

  res.render("car-page", carData);
});

app.get('/car/:carId/note', (req, res) => {
  const userId = req.session.username ? req.session.userId : null;
  if (!userId) {
    return res.status(401).send("Unauthorized");
  }

  const carId = req.params.carId; 
  return res.status(501).send("Not Implemented");
  ;// Save the note to database for this car ID
})


app.post('/signup', async (req, res) => {

  const { username, email, password } = req.body;
  try {
    passwordHash = await hashPassword(password);
  } catch (err) {
    console.error("Error hashing password", err);
    return res.status(500).send("Internal server error");
  }

  fetchsuser.saveUser(req, username, email, passwordHash, res);

})

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  fetchsuser.fetchUser(req, email, password, res);
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




app.post('/account/add-car', async (req, res) => {
    const { userId, make, model, trimId } = req.body;

    if (!userId || !make || !model || !trimId) {
        return res.status(400).send("Missing required fields");
    }

    try {
        const userRef = db.collection('users').doc(userId);
        const carsRef = userRef.collection('cars');
        
        // Check how many cars user already has
        const snapshot = await carsRef.get();
        if (snapshot.size >= 3) {
            return res.status(400).send("You can only save up to 3 cars");
        }

        // Save the car
        await carsRef.add({
            make,
            model,
            trimId,
            createdAt: new Date()
        });

        res.status(200).send("Car saved successfully");
    } catch (err) {
        console.error("Error saving car:", err);
        res.status(500).send("Error saving car");
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
  res.end(JSON.stringify({ gpt_response: gpt_output }));
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