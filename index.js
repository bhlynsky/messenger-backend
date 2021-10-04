const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const groupRoutes = require('./routes/group');
const messageRoutes = require('./routes/message');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const cors = require('cors');
const server = require('http').createServer(app);
const WebSocket = require('ws');
const webSocketServer = new WebSocket.Server({ server });
const messageController = require('./messageController');

//setup
dotenv.config();

const dbConnectionString = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

//middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/group', groupRoutes);
app.use('/api/message', messageRoutes);

/// websocket "router"
webSocketServer.on('connection', (ws) => {
    ws.on('message', (message) =>
        messageController(message, webSocketServer, ws)
    );
    ws.on('error', (err) => ws.send(err));

    ws.send('Hi there, I am a WebSocket server');
    console.log('Client connected.');
});

async function start() {
    try {
        await mongoose.connect(
            dbConnectionString,
            {
                useNewUrlParser: true,
            },
            () => {
                console.log('Connected to mongoDB');
            }
        );
        app.listen(PORT, () => {
            console.log('http server Started ');
        });

        server.listen(9000, () => console.log('Web socket server started'));
    } catch (e) {
        console.log(e);
    }
}

start();
