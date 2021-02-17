require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig'); //
const flash = require('connect-flash');
const axios = require('axios')


const app = express();
app.set('view engine', 'ejs');

// Session 
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('./middleware/isLoggedIn');

// MIDDLEWARE
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);

// Session Middleware

// secret: What we actually will be giving the user on our site as a session cookie
// resave: Save the session even if it's modified, make this false
// saveUninitialized: If we have a new session, we save it, therefore making that true

const sessionObject = {
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: true
}
app.use(session(sessionObject));
// Passport
app.use(passport.initialize()); // Initialize passport
app.use(passport.session()); // Add a session
// Flash 
app.use(flash());
app.use((req, res, next) => {
  console.log(res.locals);
  res.locals.alerts = req.flash();
  res.locals.currentUser = req.user;
  next();
});

// Controllers
app.use('/auth', require('./controllers/auth'));

//Homepage - Login - SignUp - Begin (Without account)
app.get('/', (req, res) => {
  res.send('sdnfls')
  })


//Spark Page - Displays random imgs from API, 3 randomized colors, and a word.
//Option for timer - save to queue or upload a finished 'flare'
app.get('/spark', async (req, res) => {
  const apiKeyHarv = process.env.Api_KeyHarv
  const apiKeyRijks = process.env.Api_KeyRijks
  const harvardUrl = `https://api.harvardartmuseums.org/image/?apikey=${apiKeyHarv}`
  const rijksUrl =   `https://www.rijksmuseum.nl/api/en/collection/?key=${apiKeyRijks}`
  const harvardResponse = await axios.get(harvardUrl)
  const rijksResponse = await axios.get(rijksUrl)

  const artDataHarv = harvardResponse.data.records
  const artDataRijks = rijksResponse.data.artObjects
  

  const artArray = [] 
  for(let i = 0; i < artDataHarv.length; i++) { 
    artArray.push(artDataHarv[i].baseimageurl) 
    
  }  
  for(let i = 0; i < artDataRijks; i++) {
    artArray.push(artDataRijks[i].webImage.url)
  }
  let rand = Math.floor(Math.random()* artArray.length) 
  let randomImg = artArray[rand]
  
  res.render('spark', { randomImg })
  })


//Usues cloudinary for uploads
app.get('/photoupload', (req, res) => {
  res.render('photoupload'//, { cloudinary }
  )
})

app.get('/queue', (req, res) => {
  res.render('queue'//, {}
  )
})

//Flare pages (user profiles)
app.get('/profile', isLoggedIn, (req, res) => {
  const { name, username } = req.user.get(); 
  res.render('profile', { name, username });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🌻 You're listening to the smooth sounds of port ${PORT} 🌻`);
});

module.exports = server;




