const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const db = require('../../config/db')
function initialize(passport){
    const authenticateUser= async (email_address, password, done) => {
        db.select('email_address','password').from('bookstore.customers').where('email_address','=',email_address)
            .then(data=>{
                const pass = data.length > 0 ? data[0].password : ''
                const isValid = bcrypt.compareSync(password, pass)
                if (isValid) {
                    return db.select('*').from('bookstore.customers').where('email_address', '=', email_address)
                        .then(user => done(null, user[0]))
                        .catch((err) => done(null, false, {message: 'Invalid credentials'}))
                }else{
                    return done(null,false,{message:'Incorrect email or password'})
                }
            })
            .catch(() => done(null,false,{message:'Incorrect email or password'}))
    }
    passport.use(new LocalStrategy({
        usernameField:'email_address',
        passwordField:'password'
        },authenticateUser))

    passport.serializeUser(function(user, cb) {
        process.nextTick(function() {
            return cb(null, user);
        });
    });
    passport.deserializeUser((user,done)=>{
        db.select('*').from('bookstore.customers').where('id','=',user.id)
            .then(user=>{
                done(null,user)
            })
            .catch(err=>done(err))
    })
}

module.exports = initialize;
