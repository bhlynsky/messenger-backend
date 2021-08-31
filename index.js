const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const groupRoutes = require('./routes/group');
const messageRoutes = require('./routes/message');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');
const cors = require('cors');

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
            console.log('server Started ');
        });
    } catch (e) {
        console.log(e);
    }
}
start();
