const db = require('../config/config');
const bcrypt = require('bcryptjs');
const { nanoid } = require('nanoid');

exports.FundAcoount = async(userinfo, req, res) => {
    const {amount, pin} = req.body;
    //console.log(userinfo);
    try {
        db('users')
            .where({
                username: userinfo[0].username
            })
            .then(async (user)=> {
                if(user[0]){
                    const validate = await bcrypt.compare(pin, user[0].pin)
                    if(validate){
                        if(amount > 0){
                            let balance = user[0].money + amount
                            db('users')
                                .where({
                                    id: user[0].id
                                })
                                .update({
                                    money: `${balance}`
                                })
                                .catch((err) => console.log(err));;

                            db('transactions')
                                .insert({
                                    id: nanoid(10),
                                    user_id: user[0].id,
                                    amount: amount,
                                    receiver: user[0].username,
                                    transaction_details: `funding ${user[0].username} account`
                                })
                                .then((transaction) => {
                                    return  res.status(200).json(`${user[0].username} account funded`)
                                })
                            
                           

                        } else{
                            res.status(403).json("invalid amount")
                        }

                         
                    } else{
                        res.status(401).json("Wrong pin")
                    }
                } else{
                    res.status(404).json("User not found")
                }
            });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        })
    }
}

exports.Transfer = async (userinfo, req, res)=>{
    const {amount, receiver, pin} = req.body;
    try {
        db('users')
            .where({
                username: userinfo[0].username
            })
            .then( async(user)=>{
                if(user[0]){
                    if(user[0].money >= amount && amount > 0){
                        const validate = await bcrypt.compare(pin, user[0].pin)
                        if(validate){
                            db('users')
                             .where({
                                 username: receiver
                             })
                             .then((user)=> {
                                 if(user[0]){
                                     let balanceR = user[0].money + amount
                                    db('users')
                                        .where({
                                            username: receiver
                                        })
                                        .update({
                                            money: balanceR
                                        })
                                        .catch((err) => console.log(err));
                                 }else {
                                    return res.status(404).json("Receiver does not exist")
                                 }
                                
                             })
                           
                            db('transactions')
                             .insert({
                                id: nanoid(10),
                                user_id: user[0].id,
                                sender: user[0].username,
                                receiver: receiver,
                                amount: amount,
                                transaction_details: `${user[0].username}, transfered ${amount} to ${receiver}`,
                             })
                             .catch((err) => console.log(err));
                        } else{
                            res.status(401).json("Wrong pin")
                        }

                        let balance = user[0].money - amount;
                        db('users')
                            .where({
                                username: user[0].username
                            })
                            .update({
                                money: balance
                            })
                            .catch((err) => console.log(err));
                         return res.status(202).json(`Funds Transfered to ${receiver} successfully` );
                        
                    } else{
                        return res.status(406).json("Insufficient Funds or invalid amount");
                    }
                } else{
                    res.status(404).json("User not found");
                }
            })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        })
    }
}

exports.Withdraw = async (userinfo, req, res)=> {
    const{ amount, bank, account_no, pin } = req.body;
    try {
        db('users')
            .where({
                username: userinfo[0].username
            })
            .then(async (user) => {
                if(user[0]){
                    if(user[0].money >= amount && amount > 0){
                        const validate = await bcrypt.compare(pin, user[0].pin)
                        if(validate){
                            //this is where we input the bank detail and account number to the Payment API
                            db('transactions')
                                .insert({
                                    id: nanoid(10),
                                    user_id: user[0].id,
                                    bank_name: bank,
                                    account_no: account_no,
                                    sender: user[0].username,
                                    receiver: 'external',
                                    amount: amount,
                                    transaction_details: `${user[0].username} withdrew ${amount} to ${bank}: ${account_no}`
                                })
                                .then((err) => console.log(err));
                        } else{
                            res.status(401).json("Wrong pin")
                        }
                        const balance = user[0].money - amount;
                        db('users')
                            .where({
                                username: user[0].username
                            })
                            .update({
                                money: balance
                            })
                            .catch((err) => console.log(err));
                        return res.status(200).json("Transaction Successful")
                    } else{
                        return res.status(406).json("Insufficient Funds");
                    }
                }else{
                    res.status(404).json("User not found");
                }
            });
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            status: false,
            msg: "an error occured"
        })
    }
}

exports.getTrn = async (userinfo, req, res)=>{
    try {
        db('transactions')
            .select({
                id: 'id',
                bank_name: 'bank_name',
                sender: "sender",
                receiver: "receiver",
                account_no: "account_no",
                amount: "amount",
                transaction_details: "transaction_details",
                reference_no: 'reference_no',
                createdAt: 'createdAt',
                updatedAt: "updatedAt"
            })
            .where({
                user_id: userinfo[0].id
            })
            .then((user)=>{
                if(user[0]){
                    res.status(200).json(user[0])
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

exports.getTrns = async (req, res)=>{
    try {
        db('transactions')
            .select({
                id: 'id',
                bank_name: 'bank_name',
                sender: "sender",
                receiver: "receiver",
                account_no: "account_no",
                amount: "amount",
                transaction_details: "transaction_details",
                reference_no: 'reference_no',
                createdAt: 'createdAt',
                updatedAt: "updatedAt"
            })
            .then((user)=>{
                if(user){
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

