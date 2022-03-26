const db = require('../config/config');
require('dotenv').config();
const { Strategy, ExtractJwt } = require('passport-jwt');

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.TOKEN
}

module.exports = (passport) => {
    passport.use(
        new Strategy(options, async(payload, done) => {
            //console.log(payload);
            await db('users')
                .where({
                    id: payload.id
                })
                .then((user) => {
                if(user){
                    done(null, user);
                    return;
                }
                    done(null, false);
                    return;
                
        })
        .catch(err => {
            done(null, false); 
            return;
        });
    })
    
    );
    passport.serializeUser(function (user, done) {
        if(user){
            done(null, user[0].id);
            return;
        }
        done(null, false);
        return;
    });

    passport.deserializeUser(function (id, done) {
        db('users')
        .where({
            id
        })
        .then((err, user)=>{
            if(user){
                done(null, user[0]);
                return;
            }
            done(null, err);
            return;
            
        });
    });
};