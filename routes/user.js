const router = require('express').Router();
const User = require('../models/User');
router.get('/', (req, res) => {
    res.send('user router');
});
//user list

router.get('/userlist/', async (req, res) => {
    try {
        const users = await User.find().limit(15);

        !users && res.status(404).json({ message: 'No users found' });

        const userDTO = users.map((user) => {
            return { userId: user.id, username: user.username };
        });

        res.status(200).json(userDTO);
    } catch (err) {
        res.status(500).json({ message: 'Unknown error' });
    }
});

router.get('/userlist/:searchQuery', async (req, res) => {
    try {
        const searchQuery = req.params.searchQuery;
        const users = await User.find({
            username: { $regex: `${searchQuery}`, $options: 'i' },
        }).limit(15);

        !users && res.status(404).json({ message: 'No users found' });

        const userDTO = users.map((user) => {
            return { userId: user.id, username: user.username };
        });

        res.status(200).json(userDTO);
    } catch (err) {
        res.status(500).json({ message: 'Unknown error' });
    }
});

module.exports = router;
