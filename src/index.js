import express from 'express';
import http from "http";
import { isIP } from "node:net";
import { matchRouter } from './routes/matches.js';
import { attachWebsocketServer } from './ws/server.js';

const configuredPort = process.env.PORT;
const PORT = configuredPort === undefined || configuredPort.trim() === "" ? 8000 : Number(configuredPort);
const HOST = process.env.HOST || "0.0.0.0";
const isHostname = (value) => {
    const hostname = value.endsWith(".") ? value.slice(0, -1) : value;
    return hostname.length > 0 && hostname.length <= 253 && hostname.split(".").every((label) =>
        label.length > 0 &&
        label.length <= 63 &&
        /^[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?$/.test(label)
    );
};

if (isIP(HOST) === 0 && (!isHostname(HOST) || /^\d+(?:\.\d+){3}$/.test(HOST))) {
    throw new Error(`Invalid HOST value: ${HOST}`);
}

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
    const boundPort = server.address().port;
    const urlHost = HOST.includes(":") ? `[${HOST}]` : HOST;
    const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${boundPort}` : `http://${urlHost}:${boundPort}`;
    console.log(`Server is running on ${baseUrl}`);
    console.log(`WebSocket server is running on ${baseUrl.replace("http", "ws")}/ws`);
});


