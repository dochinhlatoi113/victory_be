const express = require("express")
const configView = require("./src/config/configView")
const routerInit =  require("./src/routers/web")
const apiRouterInit = require("./src/routers/api")
const path = require("path")
const bodyParser = require('body-parser');
const port = 1225

const cookieParser = require('cookie-parser');
const session =  require("express-session")
const flash = require('connect-flash');
const db = require("./src/config/db/connect")
const multer  =   require('multer');


const passport = require('passport');
var LocalStrategy   = require('passport-local').Strategy;
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
const options = {

}

app.use(cookieParser());
require('dotenv').config();
 // parse application/x-www-form-urlencoded

// flash message
app.use(session({
  secret: 'session_cookie_secret',
  resave: false,
  saveUninitialized: false
}))
app.use(flash())
//validate

//
const {key} = process.env
// parse application/json
app.use(bodyParser.json())
//init web route
routerInit(app)
//init api route
apiRouterInit(app)
// init web view

configView(app)
app.set('views', path.join(__dirname, './src/views'));
// connect db
// static file
app.use(express.static(path.join(__dirname, './src/public')))
 db.connectDb()
//static file
//passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

///port    
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

