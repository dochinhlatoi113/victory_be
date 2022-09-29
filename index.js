const express = require("express")
const configView = require("./src/config/configView")
const routerInit =  require("./src/routers/web")
const apiRouterInit = require("./src/routers/api")
const path = require("path")
const bodyParser = require('body-parser');
const app = express()
const port = 1225
const session =  require("express-session")
const flash = require("express-flash")
const db = require("./src/config/db/connect")
const multer  =   require('multer');
 // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))
// flash message
app.use(session({
  secret:'secret',
  cookie: {maxAge : 600000 },
  resave : false,
  saveUninitialized:false
}))
app.use(flash())
//

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




///port    
app.listen(port, () => {
  console.log(`listening on port ${port}`)
})

