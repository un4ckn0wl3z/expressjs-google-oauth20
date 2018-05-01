const express = require('express');

const path = require('path');

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const methodOverride = require('method-override');

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');

const session = require('express-session');

const passport = require('passport');

// Load User model
require('./models/User');
// Load Story model
require('./models/Story');

// Keys
const keys = require('./config/keys');

// Handlebars helpers

const {
  truncate,
  stripTags,
  formatDate,
  select,
  editIcon
} = require('./helpers/hbs');

// Passport

require('./config/passport')(passport);

// Load Routes

const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

// Map global promises
mongoose.Promise = global.Promise;

// Mongoose Connect
mongoose.connect(keys.mongoURL)
.then(() => console.log('MongoDB Connected...'))
.catch((err) => console.log(err));

const app = express();





// Body Parser

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// Method Override

app.use(methodOverride('_method'));

// Handlebars Middlewares 

app.engine('handlebars',exphbs({
  helpers:{
    truncate: truncate,
    stripTags: stripTags,
    formatDate: formatDate,
    select:select,
    editIcon: editIcon
  },
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

// Set static folder
app.use(express.static(path.join(__dirname,'public')));

// Use Routes

app.use('/',index);
app.use('/auth',auth);
app.use('/stories',stories);


const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});