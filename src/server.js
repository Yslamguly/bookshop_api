if(process.env.NODE_ENV !== 'production'){
        require("dotenv").config();
}
const express = require('express')
const cors = require('cors')
const passport = require('passport')
const flash = require("connect-flash");
const session = require("express-session");
const initializePassport = require('./helpers/passport-config')
const customerRoutes = require('./routes/customers.route')
const shoppingCartRoutes = require('./routes/shopping_cart.route')
const booksRoutes = require('./routes/books.route')
const categoriesRoutes = require('./routes/categories.route')
const addressesRoutes = require('./routes/addresses.route')
const orderRoutes = require('./routes/order.route')
const stripeRoutes = require('./routes/stripe.route')
const routes = require('./routes/routes')


const app = express();
initializePassport(passport)
app.use(express.urlencoded({extended: false}));
app.use('/stripe/webhook', express.raw({type: "*/*"}));
app.use(express.json());
app.use(cors())
app.use(
    session({
        // Key we want to keep secret which will encrypt all of our information
        secret: process.env.COOKIE_SECRET,
        // Should we resave our session variables if nothing has changes which we dont
        resave: false,
        // Save empty value if there is no value which we do not want to do
        saveUninitialized: false,
        cookie: { maxAge: 600000, //after 10 minutes the user will be logged out
                  // secure: false,  // if true only transmit cookie over https
                  // httpOnly: false, // if true prevent client side JS from reading the cookie
        }
    })
);
// Function inside passport which initializes passport
app.use(passport.initialize());
// Store our variables to be persisted across the whole session. Works with app.use(Session) above
app.use(passport.session());
app.use(flash());
app.use('/customers',customerRoutes)
app.use('/shopping_cart',shoppingCartRoutes)
app.use('/books',booksRoutes)
app.use('/categories',categoriesRoutes)
app.use('/addresses',addressesRoutes)
app.use('/orders',orderRoutes)
app.use('/stripe',stripeRoutes)
app.use('/',routes)
app.listen(8000)
module.exports = app;



















// app.use(
//     session({
//         secret: process.env.COOKIE_SECRET,
//         cookie: {
//             secure: process.env.NODE_ENV === "production" ? "true" : "auto",
//             sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
//         },
//         resave: false,
//         saveUninitialized: false,
//     })
// );
// app.use(passport.session());










// app.use('/oauth2/redirect/google',customersController.googleCallback);
// app.use('/google/login',customersController.signinGoogle);



// Request is something that comes from the user
// Response is with what server responds to the user
//              HOW TO SEND STATIC FILES
//app.use(express.static(__dirname + '/database'))
