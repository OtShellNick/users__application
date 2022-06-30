require('dotenv').config({path: '../../.env'});
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const { connect, ObjectId } = require("../db");
const {SECRET_KEY} = process.env;

let users;

(async () => {
    if(!users?.isConnected()) users = await connect();
})()

const hash = (password) => {
    const hash = crypto.createHash("sha256");
    hash.update(password);
    return hash.digest("hex");
};

const auth = () => async (req, res, next) => {
    const {authorization} = req.headers;
    if (!authorization) return res.status(401).send({error: 'Not Authorized'});

    const user = await findUserBySessionId(authorization);

    delete user.password;
    delete user._id;
    
    req.user = user;
    req.sessionId = authorization;
    next();
};


const createUser = async ({ name, email, password, birthday, gender, photo }) => {
    const newUser = {
        name,
        email,
        password: hash(password),
        birthday,
        gender,
        photo
    };

    const { insertedId } = await users.collection("users").insertOne(newUser);

    return { ...newUser, id: insertedId.toString() };
};

const updateUser = async (data) => {
    const newUser = {...data, password: hash(data.newPassword)};

    delete newUser.email;
    delete newUser.newPassword;

    const { value: user } = await users.collection('users').findOneAndUpdate({email: data.email}, {$set: newUser}, {returnDocument: 'after'});

    return user;
}

const findUserByEmail = async (email) => await users.collection("users").findOne({email}).catch(console.log);

const findUserById = async id => await users.collection('users').findOne({_id: new ObjectId(id)});

const findUserBySessionId = async jwt => {
    console.log(jwt)
    const session = await users.collection('sessions').findOne({sessionId: jwt});
    console.log('session', session)
    return await findUserById(session.userId);
}

const createSession = async (id) => {

    const userAuth = await getSessionByUserId(id);
    console.log(userAuth)
    if(userAuth) return userAuth.sessionId;

    const sessionId = jwt.sign(id, SECRET_KEY);
    await users.collection("sessions").insertOne({ sessionId, userId: id });
    return sessionId;
};

const getSessionByUserId = async userId => await users.collection('sessions').findOne({userId});

const deleteSession = async jwt => await users.collection('sessions').deleteOne({sessionId: jwt});

const getAllUsers = async () => await users.collection('users').find({}).toArray();


module.exports = {createUser, findUserByEmail, createSession, hash, getSessionByUserId, deleteSession, getAllUsers, auth, updateUser};
