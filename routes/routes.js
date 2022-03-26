const express = require('express');
const router = express.Router();
const { Register, Login, userAuth, getUsers, profile, deleteUser, deleteUserTest, updateUser } = require('../controller/user');
const { FundAcoount, Transfer, Withdraw, getTrn, getTrns } = require('../controller/transaction')

router
.post('/register', Register);

router
.post('/login', Login);

router
.get('/users', userAuth, getUsers);

router
.patch('/user/update', userAuth,  async(req, res) => {
    await updateUser(req.user, req, res);
});

router
.delete('/user/delete', userAuth,  async(req, res) => {
    await deleteUser(req.user, req, res);
});

router
.delete('/user/deletetest', userAuth, deleteUserTest );

router
.get('/user/profile', userAuth, async(req, res)=>{
    return res.json(profile(req.user))
});

router
.post('/user/transfer', userAuth, async(req, res) => {
    await Transfer(req.user, req, res);
});

router
.post('/user/fund', userAuth, async(req, res) => {
    await FundAcoount(req.user, req, res);
});

router
.post('/user/withdraw', userAuth, async(req, res) => {
    await Withdraw(req.user, req, res);
});

router
.get('/user/getTrn', userAuth, async(req, res) => {
    await getTrn(req.user, req, res);
});

router
.get('/user/getTrns', userAuth, getTrns);

module.exports= router;
