const db = require('../config/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { nanoid } = require('nanoid');
require('dotenv').config();
const passport = require('passport')

exports.Register = async(req, res)=> {
    const {fullname, username, email, password, pin} = req.body;
    try {
        await db('users')
                .where({
                    email: email,
                    username: username
                })
                .then(async (user) => {
                    if(user[0]){
                        //console.log(user[0]);
                        res.status(302).json({
                            status: false,
                            msg: 'User already exist'
                        })
                    } else{
                        const salt = await bcrypt.genSalt(12);
                        const pinsalt = await bcrypt.genSalt(6);
                        const hashedPin = await bcrypt.hash(pin, pinsalt);
                        const hashedPass = await bcrypt.hash(password, salt);
                        await db('users')
                                .insert({
                                    id: nanoid(10),
                                    fullname: fullname,
                                    username: username,
                                    email: email,
                                    money: 0,
                                    password: hashedPass,
                                    pin: hashedPin,
                                })
                                .then((user)=>{
                                    return res.status(201).json({
                                        status: true,
                                        mesaage: "user Account created successfully"
                                    })
                                });
                            };
                    });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        })
    }
}

exports.Login = async (req, res)=>{
    const {username, password} = req.body;
    try {
        await db('users')
            .where({
                username: username
            })
            .then(async (user)=> {
                if(!user[0]){
                    return res.status(404).json({
                        Message: 'User does not exist',
                        success: false
                    });
                } else{
                    const validate = await bcrypt.compare(password, user[0].password);
                    if(validate){
                        let token = jwt.sign(
                            {
                                fullname: user[0].fullname,
                                email: user[0].email,
                                username: user[0].username,
                                id: user[0].id
                            }, process.env.TOKEN, { expiresIn: "24h" }
                        );

                        let result ={
                            fullname: user[0].fullname,
                            username: user[0].username,
                            token: `Bearer ${token}`,
                            expiresIn: 24
                        };

                        res.status(200).json({
                            ...result,
                            status: "successfully logged in",
                            success: true
                        })
                    } else{
                        return res.status(403).json({
                            message: 'wrong password',
                            success: false
                        });
                    }
                }
            })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        });
    }
}

exports.userAuth = passport.authenticate('jwt', {session: true});

exports.profile = user => {
    return {
         id: user[0].id,
         fullname: user[0].fullname,
         username: user[0].username,
         email: user[0].email,
         money: user[0].money,
         updatedAt: user[0].updatedAt,
         createdAt: user[0].createdAt
        };
 };

exports.getUsers = async(req, res) => {
    try {
        await db('users')
            .select({
                id: 'id',
                fullname: "fullname",
                username: "username",
                email: "email",
                money: "money"
            })
            .then((user) => {
                if(user) {
                    res.status(200).json(user)
                } else{
                    res.status(404).json("No user found")
                }
            })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        });
    }
}

exports.deleteUser = async(userinfo, req, res) =>{
    try {
        db('users')
         .where({
             username: userinfo[0].username
         })
         .del()
         .catch((err) => console.log(err));
         return res.status(200).json(`user ${userinfo.username} account deleted successfully`)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        });
    }
}

exports.deleteUserTest = async(req, res) =>{
    try {
        const { username} = req.body
       await db('users')
         .where({
             username: username
         })
         .del()
         .catch((err) => console.log(err));
         return res.status(200).json(`user ${username} account deleted successfully`)
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        });
    }
}

exports.updateUser = async (userinfo, req, res) => {
    try {
       await db('users')
            .where({
                username: userinfo[0].username
            })
            .update(
                req.body
            )
            .catch((err) => console.log(err));
        return res.status(200).json("user information updated")
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        });
    }
}