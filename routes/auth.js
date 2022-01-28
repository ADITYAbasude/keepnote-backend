const bcryptjs = require('bcryptjs');
const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/user');
const router = express.Router();
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser');



// const JWTKey = process.env.JWT_hidden_key


// auth singup
router.post('/singup', [
    //some validation check befor storing the data 
    body('name').isLength({ min: 1 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 })

], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }

    try {

        let user = await User.findOne({ email: req.body.email });
        if (user) {
            res.status(404).json({ error: "enter a valid value" })
        }
        //generating salt value 
        const salt = await bcryptjs.genSalt(10);
        const hashingThePassword = await bcryptjs.hash(req.body.password, salt);  //generating hashing of password and salt 
        user = await User.create({     //creating user
            name: req.body.name,
            email: req.body.email,
            password: hashingThePassword
        })
        const userId = { user: { id: user.id } }
        const JWTToken = jwt.sign(userId, "13@777adityaKhufhiyaKey");
        res.json({JWTToken})
    } catch (error) { // when unknown error will occured then catch will be invoke.
        console.log(error)
    }
})


// auth login
router.post('/login', [
    //some validation check befor storing the data 
    body('email').isEmail(),
    body('password').isLength({ min: 8 })

], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(500).json({ error: error.array() })
    }

    const { email, password } = req.body;
    try {
        let findUser = await User.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ error: "Invalid user" });
        }

        const comparePasswors = await bcryptjs.compare(password, findUser.password);

        if (!comparePasswors) {
            return res.status(500).json({ error: error.array() })
        }

        const data = {
            user: {
                id: findUser.id
            }
        }

        const JWTToken = jwt.sign(data, "13@777adityaKhufhiyaKey")
        res.json({ JWTToken })
    }
    catch (error) {
        console.log(error);
    }

})



// getting userdata
router.post('/getUser', fetchUser, async (req, res) => {

    try {
        const userId = req.user.id;
        const user  = await User.findById(userId).select("-password");
        res.json({user});
        res.send(user)
    } catch (error) {
        console.log(error);
        res.status(500).send("Internet server error")
    }

})

module.exports = router