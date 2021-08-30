const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/', (req, res) => {
    res.send('auth router');
});

//register
router.post('/register', async (req, res) => {
    try {
        //encode password
        const salt = await bcrypt.genSalt(10);
        console.log(req.body);
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
        console.log(err);
    }
});
//login
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).json('user not found');

        const isValidPassword = await bcrypt.compare(
            req.body.password,
            user.password
        );

        !isValidPassword && res.status(400).json('wrong password ');

        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;
