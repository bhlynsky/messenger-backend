const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const errors = require('../services/constants');

router.get('/', (req, res) => {
    res.send('auth router');
});

//register
router.post('/register', async (req, res) => {
    try {
        //check if emails is taken
        const email = await User.findOne({ email: req.body.email });

        if (email) {
            res.status(400).json({
                message: errors.EMAIL_ALREADY_IN_USE,
            });
        }

        //check if username is taken
        const username = await User.findOne({ username: req.body.username });

        if (username) {
            res.status(400).json({
                message: errors.NAME_ALREADY_IN_USE,
            });
        }
        //encode password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        //new user doc
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });
        //response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//login

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json({ message: errors.USER_NOT_FOUND });

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!isValidPassword) {
            res.status(400).json({ message: errors.WRONG_PASSWORD });
        }

        console.log('User logged : ' + req.body.email);

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
