const express = require('express');
const app = express();
const router = require('./routes/routes');
const passport = require('passport');
require('dotenv').config();
const Session = require('express-session');
const redis = require('redis');
const RedisStore = require('connect-redis')(Session);
const cors = require("cors");
const bodyParser = require('body-parser');



const redisURL = process.env.REDIS_URL
const redisClient = redis.createClient({
  url: redisURL,
  no_ready_check: true,
  legacyMode: true
});


//Configure redis client
redisClient.connect().catch(console.error);

redisClient.on('connect', function (err) {
    console.log('Connected to redis successfully');
  });

redisClient.on('error', function (err) {
  console.log('Could not establish a connection with redis. ' + err);
});

app.use(Session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: true
    },
    store: new RedisStore({ client: redisClient })
}));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
require('./middlewares/passport')(passport);
app.use('/', router)


const port = process.env.PORT

app.listen(port, ()=> {
    console.log('listening to https://localhost:3000')
})

module.exports = app;