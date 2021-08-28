const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const groupRoutes = require('./routes/group');
const messageRoutes = require('./routes/message');
const userRoute = require('./routes/user');
const authRoute = require('./routes/auth');

//setup
dotenv.config();

const dbConnectionString = process.env.MONGO_URL;
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());

app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);

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
