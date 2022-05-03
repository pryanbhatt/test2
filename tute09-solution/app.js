const exphbs = require('express-handlebars')
const flash = require('express-flash')
const session = require('express-session')

// Import express
const express = require('express')
// Set your app up as an express app
const app = express()

require('./models')

// configure Handlebars
app.engine(
    'hbs',
    exphbs.engine({
        defaultLayout: 'main',
        extname: 'hbs',
    })
)
// set Handlebars view engine
app.set('view engine', 'hbs')

app.use(express.static('public'))

// Set up to handle POST requests
app.use(express.json()) // needed if POST data is in JSON format
app.use(express.urlencoded({ extended: false })) // only needed for URL-encoded input

// Flash messages for failed logins, and (possibly) other success/error messages
app.use(flash())

// Track authenticated users through login sessions
app.use(
    session({
    	// The secret used to sign session cookies (ADD ENV VAR)
        secret: process.env.SESSION_SECRET || 'keyboard cat',
        name: 'demo', // The cookie name (CHANGE THIS)
        saveUninitialized: false,
        resave: false,
        cookie: {
            sameSite: 'strict',
            httpOnly: true,
            secure: app.get('env') === 'production'
        },
    })
)

if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
}

// Initialise Passport.js
const passport = require('./passport')
app.use(passport.authenticate('session'));

// Load authentication router
const authRouter = require('./routes/auth')
app.use(authRouter)

// link to our router
const peopleRouter = require('./routes/peopleRouter')

// the demo routes are added to the end of the '/people' path
app.use('/people', peopleRouter)

// Tells the app to send the string: "Our demo app is working!" when you hit the '/' endpoint.
app.get('/', (req, res) => {
    res.render('index.hbs')
})

// Tells the app to listen on port 3000 and logs that information to the console.
app.listen(process.env.PORT || 3000, () => {
    console.log('Demo app is listening on port 3000!')
})
