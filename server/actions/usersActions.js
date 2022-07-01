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

    try {
        const user = await findUserBySessionId(authorization);

        delete user.password;
        delete user._id;

        req.user = user;
        req.sessionId = authorization;
        next();
    } catch (e) {
        console.log('error auth', e);
        return res.status(401).send({error: 'Not Authorized'});
    }
};

const createUser = async ({ name, email, password, birthday, gender, photo }) => {
    let newUser = {
        name,
        email,
        password: hash(password),
        birthday,
        gender,
        photo
    };

    if(photo) {
        const photoId = await savePhoto(photo);
        newUser = {...newUser, photo: photoId};
    }

    const { insertedId } = await users.collection("users").insertOne(newUser);

    return { ...newUser, id: insertedId.toString() };
};

const updateUser = async (data) => {
    let newUser = {...data};

    if(data.newPassword) {
        newUser = {...newUser, password: hash(data.newPassword)};
        delete newUser.newPassword;
    }

    if(data.newPhoto) {
        if(data.photo) await deletePhoto(data.photo);
        const photoId = await savePhoto(data.newPhoto);
        delete newUser.newPhoto;
        newUser = {...newUser, photo: photoId};
    }

    delete newUser.email;

    const { value: user } = await users.collection('users').findOneAndUpdate({email: data.email}, {$set: newUser}, {returnDocument: 'after'});

    return user;
}

const findUserByEmail = async (email) => await users.collection("users").findOne({email})
;

const findUserById = async id => await users.collection('users').findOne({_id: new ObjectId(id)});

const findUserBySessionId = async jwt => {

    const session = await users.collection('sessions').findOne({sessionId: jwt});

    return await findUserById(session.userId);
}

const createSession = async (id) => {

    const userAuth = await getSessionByUserId(id);

    if(userAuth) return userAuth.sessionId;

    const sessionId = jwt.sign(id, SECRET_KEY);
    await users.collection("sessions").insertOne({ sessionId, userId: id });
    return sessionId;
};

const getSessionByUserId = async userId => await users.collection('sessions').findOne({userId});

const deleteSession = async jwt => await users.collection('sessions').deleteOne({sessionId: jwt});

const getAllUsers = async () => await users.collection('users').find({}).toArray();

const savePhoto = async (photo) => {
    const { insertedId } = await users.collection('photo').insertOne({photo});

    return insertedId.toString();
};

const getPhoto = async photoId => await users.collection('photo').findOne({_id: ObjectId(photoId)});

const deletePhoto = async photoId => await users.collection('photo').findOneAndDelete({_id: ObjectId(photoId)});


module.exports = {createUser, findUserByEmail, createSession, hash, getSessionByUserId, deleteSession, getAllUsers, auth, updateUser, savePhoto, getPhoto};
