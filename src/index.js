import express from 'express';
import http from "http";
import { matchRouter } from './routes/matches.js';
import { attachWebsocketServer } from './ws/server.js';

const PORT = Number(process.env.PORT) || 8000;
const HOST = (process.env.HOST || "0.0.0.0").replace(/[^a-zA-Z0-9.-]/g, "");
const app = express();

const server = http.createServer(app);

app.use(express.json());

app.use('/matches', matchRouter);

app.use('/', (req, res) => {
    res.send('Hello from Express server!');
});


const { broadcastMatchCreated } = attachWebsocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket server is running on ${baseUrl.replace("http", "ws")}/ws`);
});


