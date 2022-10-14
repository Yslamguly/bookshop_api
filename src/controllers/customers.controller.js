require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../../config/db')
const validations = require('../helpers/validations')
const passport = require("passport");

exports.test = (req,res)=>{
    res.send('hello world');
}

exports.register = async (req,res)=>{
    const {first_name,last_name,email_address,phone_number,password,confirm_password} = req.body;
    let errors = []
    validations.validatePassword(password,confirm_password,errors)
    if(errors.length <= 0){
        const hash = await bcrypt.hash(password,10);
        return db('bookstore.customers').returning('*').insert({
            first_name:first_name,
            last_name:last_name,
            email_address:email_address,
            phone_number:phone_number,
            password:hash
        }).then(customer=>res.json(customer[0]))
          .catch(err=>res.send(err).status(400))
    }else{
        res.send(errors).status(400)
    }
}

exports.login = async (req,res,next)=>{
    passport.authenticate("local",{failureFlash: true,successFlash: 'Successful!' },(err,user,info)=>{
        if (err) { return next(err); }
        if (!user) { return res.status(400).json(info); }
        req.logIn(user,(err)=>{
            if(err){res.status(400).json(info);}
            console.log(req.session)
            res.send(req.user);
        })
    })(req,res,next)
}
// req.session.flash.error
























// exports.signinGoogle = passport.authenticate('google',{scope:['profile']})
// exports.googleCallback = passport.authenticate('google',{session:true})
//
//
//
// passport.use(new GoogleStrategy({
//     clientID:process.env['GOOGLE_CLIENT_ID'],
//     clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
//     callbackURL: '/oauth2/redirect/google',
//     userProfileURL: "https: //www.googleapis.com/oauth2/v3/userinfo",
//     scope: ['profile']
// }, (_,__,profile,done,res)=>{
//     const account = profile._json;
//     console.log(account);
//     return db('bookstore.customers').returning('*').insert({
//         first_name:account.name,
//         last_name: account.name,
//         email_address:'islamguly28@gmail.com',
//         phone_number:'sfbkferfw',
//         password:'efwfwefew'
//     }).then(customer=>res.json(customer[0]))
//         .catch(err=>res.send(err).status(400))
// }))
