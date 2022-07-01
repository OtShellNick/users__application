const express = require("express");
const bodyParser = require("body-parser");
const {validate} = require("../validation");
const {findUserByEmail, createUser, createSession, hash, deleteSession, auth, getAllUsers, updateUser, getPhoto} = require("../actions/usersActions");

const router = express.Router();

router.post('/signup', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {name, email, password, gender, birthday, photo} = req.body;

    const valid = validate({name, email, password, gender, birthday, photo}, 'signup');

    if (Array.isArray(valid)) return res.status(422).send({error: valid});

    try {
        const user = await findUserByEmail(email);

        if (user) return res.status(409).send({error: 'Email is already exists'});

        const newUser = await createUser({name, email, password, gender, birthday, photo});

        const appSessionId = await createSession(newUser.id);

        res.send({appSessionId});
    } catch (err) {
        console.log('error signup', err)
        res.status(500).send({error: 'Internal Server Error'})
    }
});

router.post('/login', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {email, password} = req.body;

    try {
        const user = await findUserByEmail(email);

        if (!user) return res.status(404).send({error: 'User not found'});

        if (user.password !== hash(password)) return res.status(401).send({error: 'Wrong password'});

        const appSessionId = await createSession(user._id.toString());

        res.send({appSessionId});
    } catch (err) {
        console.log('error login', err)
        res.status(500).send({error: 'Internal Server Error'})
    }
});

router.post('/logout', bodyParser.urlencoded({extended: false}), async (req, res) => {
    const {jwt} = req.body;

    try {
        await deleteSession(jwt);
        res.send('Success');
    } catch (e) {
        console.log('error logout', e);
        res.status(500).send({error: 'Internal Server Error'})
    }
});

router.get('/all', auth(), async (req, res) => {
    const users = await getAllUsers();
    users.forEach(user => {
        delete user.password;
        delete user._id;
    });

    res.send({users});
});

router.get('/self', auth(), async (req, res) => {
    const {user} = req;

    res.send({user});
});

router.post('/update', auth(), bodyParser.urlencoded({extended: false}), async (req, res) => {
    const userForUpdate = req.body;

    try {
        const user = await updateUser(userForUpdate);

        delete user._id;
        delete user.password;

        res.send({user});
    } catch (e) {
        console.log('error update', e);
        res.status(500).send({error: 'Internal Server Error'})
    }
});

router.get('/photo/:id', async (req, res) => {
    const {id} = req.params;

    const photo = await getPhoto(id);
    res.send(photo);
})

module.exports = router;