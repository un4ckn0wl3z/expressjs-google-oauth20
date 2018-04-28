const express = require('express');

const exphbs = require('express-handlebars');

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const passport = require('passport');

// Load user model
require('./models/User');

// Keys
const keys = require('./config/keys');

// Passport

require('./config/passport')(passport);

// Load Routes

const index = require('./routes/index');
const auth = require('./routes/auth');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURL)
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log(err));

const app = express();

// Handlebars Middlewares 

app.engine('handlebars',exphbs({
  defaultLayout:'main'
}));

app.set('view engine','handlebars');


// Cookie Parser midlewares
app.use(cookieParser());

// Sessions midlewares
app.use(session({
  secret: 'un4ck',
  resave: false,
  saveUninitialized: false
}));

// Passport midlewares
app.use(passport.initialize());
app.use(passport.session());


// Set Global vars
app.use((req,res,next) => {
  res.locals.user = req.user || null
  next();
});

// Use Routes

app.use('/',index);
app.use('/auth',auth);



const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});