require('dotenv').config();
const express = require('express');
const layouts = require('express-ejs-layouts');
const session = require('express-session');
const passport = require('./config/ppConfig'); //
const flash = require('connect-flash');
const axios = require('axios')
const multer = require('multer');
const cloudinary = require('cloudinary');
const methodOverride = require('method-override')

const app = express();
app.set('view engine', 'ejs');

// Session 
const SECRET_SESSION = process.env.SECRET_SESSION;
const isLoggedIn = require('./middleware/isLoggedIn');
const db = require('./models');

// MIDDLEWARE
const upload = multer({ dest: './uploads/' });
app.use(require('morgan')('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
app.use(layouts);
app.use(methodOverride('_method'))



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
  res.render('homepage', { layout: 'homepage'})
});

app.get('/muse-how-to', (req, res) => {
  res.render('musehowto')
})

//Spark Page - Displays random imgs from API, 3 randomized colors, and a word.
//Option for timer - save to queue or upload a finished 'flare'
app.get('/spark', isLoggedIn, async (req, res) => {
  try {
  const apiKeyHarv = process.env.Api_KeyHarv
  const apiKeyRijks = process.env.Api_KeyRijks
  const harvardUrl = `https://api.harvardartmuseums.org/image/?apikey=${apiKeyHarv}`
  const rijksUrl = `https://www.rijksmuseum.nl/api/en/collection/?key=${apiKeyRijks}`
  
  const harvardResponse = await axios.get(harvardUrl)
  const rijksResponse = await axios.get(rijksUrl)
 
  const harvArtData = harvardResponse.data.records
  const rijksArtData = rijksResponse.data.artObjects
 
  
  
  const artArray = [] 
  for(let i = 0; i < harvArtData.length; i++) { 
    artArray.push(harvArtData[i])   
  }  
  for(let i = 0; i < rijksArtData.length; i++) {
    artArray.push(rijksArtData[i])
  }
  let rand = Math.floor(Math.random()* artArray.length) 
  let randomImg = artArray[rand]
  
  const colorsArray = []                                             
   for (i = 0; i < 9; i++) { 
    color = Math.floor(Math.random()*255) 
    colorsArray.push(color)
     
 } 

  //NEEDS TIMER OPTION
  res.render('spark', { randomImg, colorsArray })
  } catch(e) {
    console.log(e.message)
  }
})

app.get('/queue', isLoggedIn, (req, res) => {
  req.user.getSparkqueues().then(function(sparkQueueResponse) {
    //title
    //artist
    //url
    //spark button
      //pull up title, artist, url and 3 new colors
    res.render('queue', { sparkQueueResponse })
  })
})

app.post('/queue', isLoggedIn, async(req, res) => {

  try {
    const createQueue = await
    
    db.sparkqueue.create({
      title: req.body.title,
      artist: req.body.artist,
      url: req.body.url
    })

    const user = await 
      db.user.findOne({where: {
        id: req.user.id}, include: [db.sparkqueue]
      })
      user.addSparkqueue(createQueue)
      res.redirect('/queue')
  } catch(e) {
    console.log(e)
  }
})

///NEED PARAM ROUTE newspark/:id
app.get('/queue/newspark/:id', isLoggedIn, async(req, res) => {
  try {
    const numId = req.params.id 
    let keyObject = await db.sparkqueue.findAll({where: {id: numId}})
    
    const colorsArray =[]                                             
    for (i = 0; i < 9; i++) { 
    let color = Math.floor(Math.random()*255) 
    colorsArray.push(color)
    }
    keyObject.colors = colorsArray
    console.log(keyObject[0].get().url)
    res.render(`newspark/idx`, { keyObject })
  } catch(e) {
    console.log(e)
  }
})



app.put('/colorsToSparkqueue', async(req, res) => {
 try {
   const {color1, color2, color3, sparkqueueId} = req.body
   const thisSpark = await db.sparkqueue.findOne({where: {id: sparkqueueId}})
   await db.sparkqueue.update({ color1, color2, color3 }, {where: {id: sparkqueueId }})
   res.render('photoupload', { thisSpark })
 } catch(e) {
   console.log(e.message)
 }
})


//Usues cloudinary for uploads
// app.get('/photoupload', isLoggedIn, (req, res) => {
  
//   res.render('photoupload')
//   //uploads photo. adds to flare model
// })

// app.post('/photouploads', upload.single('myFile'), function(req, res) {
//   res.send(req.file);
// });

app.put('/photoupload', upload.single('inputFile'), (req, res) => {
  const img = req.file.path
  cloudinary.uploader.upload(img, (imgResult) => {
    // SAVE CLUDINARY UPLOAD URL to uploadurl in flare database to current user.
    db.sparkqueue.update({
      uploadurl: imgResult.url,
      flaretitle: req.body.flaretitle},
      {where: { id: req.body.id },
      }).then(result => {
        const { name, username } = req.user.get();
        
        res.redirect('/profile')
      })
  })
})

// Flare pages (user profiles)
// displays title, artist, url, photo upload, user name,color1, color2, color3, flaretitle 
app.get('/profile', isLoggedIn, (req, res) => {
  db.user.findOne({where: {
    id: req.user.id}, include: [db.sparkqueue]}).then(function(user){
    const { name, username, imgResult } = req.user.get(); 
    console.log(req.user.get)
    res.render('profile', { images: user.sparkqueues, name, username })
  }) 
});


const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`🌻 You're listening to the smooth sounds of port ${PORT} 🌻`);
});

module.exports = server;




