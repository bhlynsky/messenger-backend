const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

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
                message: 'User with this email already exists',
            });
        }

        //check if username is taken
        const username = await User.findOne({ username: req.body.username });
        username &&
            res.status(400).json({
                message: 'User with this name already exists',
            });

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
        !user &&
            res
                .status(404)
                .json({ message: 'User not found. Check your email.' });

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        !isValidPassword &&
            res.status(400).json({ message: 'Wrong password. ' });
        console.log('User logged : ' + req.body.email);

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
