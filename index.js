const http = require('http');
import dotenv from "dotenv";
dotenv.config();

// index.js - Simple Node.js HTTP server


const HOST = process.env.HOST || '0.0.0.0';
const PORT = parseInt(process.env.PORT || '3000', 10);

const server = http.createServer((req, res) => {
    // Basic routing
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
        return;
    }

    // Default response
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Hello from Node.js!\n');
});

server.listen(PORT, HOST, () => {
    console.log(`Server listening at http://${HOST}:${PORT}`);
});

// Graceful shutdown
const shutdown = (signal) => {
    console.log(`Received ${signal}. Shutting down...`);
    server.close((err) => {
        if (err) {
            console.error('Error during shutdown:', err);
            process.exit(1);
        }
        process.exit(0);
    });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));