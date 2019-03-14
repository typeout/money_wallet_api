const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const localStrategy = require('passport-local');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Keys..
const dbURI = require('./config/keys.js').mongoURI;
const portURI = process.env.PORT || 5000;

//mongodb connection
mongoose.connect(dbURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

//models
const User = require("./models/user.js");

//passport setup with passport-local-mongoose methods
app.use(passport.initialize());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//routes
const indexRoutes = require('./routes/index');
app.use(indexRoutes);
const transactionRoutes = require('./routes/transaction');
app.use(transactionRoutes);
const userRoutes = require('./routes/user');
app.use(userRoutes);

app.listen(portURI, () => console.log(`Server started on port: ${portURI}`));