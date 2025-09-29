const http = require('http');
const path = require('path'); 
const express = require('express');
const app = express();
// index.js - Simple Node.js HTTP server

app.use(express.static(path.join(__dirname, 'public')));


const HOST = process.env.HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '3000', 10);

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