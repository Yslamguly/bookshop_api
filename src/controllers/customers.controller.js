require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../../config/db')
const validations = require('../helpers/validations')
const functions = require('../helpers/functions');
const passport = require("passport");
const jwt = require('jsonwebtoken');

exports.test = (req,res)=>{
    res.send('hello world');
}

exports.register = async (req,res)=>{
    const {first_name,last_name,email_address,phone_number,password,confirm_password} = req.body;
    const errors = {}
    validations.validateName(first_name,last_name,errors);
    validations.validatePassword(password,confirm_password,errors)
    validations.validateEmail(email_address,errors)
    validations.validatePhoneNumber(phone_number,errors)
    const isEmpty = Object.keys(errors).length === 0;


    if(isEmpty){
        const hash = await bcrypt.hash(password,10);
        db.transaction(trx => {
            trx.insert({
                first_name:functions.capitalizeName(first_name),
                last_name:functions.capitalizeName(last_name),
                email_address:email_address,
                phone_number:phone_number,
                password:hash
            }).into('bookstore.customers').returning('*')
                .then(customers=>{
                    console.log(customers)
                    return trx('bookstore.shopping_cart')
                        .returning('*')
                        .insert({
                            customer_id:customers[0].id,
                            date_created:new Date()
                        }
                    ).then(()=>{
                        const body = {
                            id:customers[0].id,
                            email_address:customers[0].email_address,
                            first_name:customers[0].first_name,
                            last_name:customers[0].last_name,
                            phone_number:customers[0].phone_number
                        }
                        const expiry_time = req.session.cookie.originalMaxAge / 1000 //600 seconds
                        jwt.sign({user:body},
                            process.env.JWT_SECRET,
                            {expiresIn : `${expiry_time}s`}, //expires in 10 minutes
                            (err,token)=>{
                                if(err){ return res.status(500).send(err)}
                                res.status(200).json({token})
                            }
                        )
                    })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        }).catch(err => res.status(409).json({message:'It seems like you already registered for this web-site'}))
    }
    else{
        res.status(400).json(errors)
    }
}

exports.login = async (req,res,next)=>{
    passport.authenticate("local",{failureFlash: true,successFlash: 'Successful!' },(err,user,info)=>{
        if (err) { return next(err); }
        if (!user) {
            return res.status(401).json(info);
        }
        req.logIn(user,
            {session:false}, //You set { session: false } because you do not want to store the user details in a session. You expect the user to send the token on each request to the secure routes.
            (err)=>{
            if(err){
                res.status(500).json(info);
            }
            const body = {
                id:user.id,
                email_address:user.email_address,
                first_name:user.first_name,
                last_name:user.last_name,
                phone_number:user.phone_number
            }
            const expiry_time = req.session.cookie.originalMaxAge / 1000 //600 seconds
            jwt.sign(body,
                process.env.JWT_SECRET,
                {expiresIn : `${expiry_time}s`}, //expires in 10 minutes
                (err,token)=>{
                    if(err){ return res.status(500).send(err)}
                    res.status(200).json({token})
                }
            )
            console.log(req.session)
            // res.json(req.user);
        })
    })(req,res,next)
}
// req.session.flash.error



// router.post(
//     '/login',
//     async (req, res, next) => {
//         passport.authenticate(
//             'login',
//             async (err, user, info) => {
//                 try {
//                     if (err || !user) {
//                         const error = new Error('An error occurred.');
//
//                         return next(error);
//                     }
//
//                     req.login(
//                         user,
//                         { session: false },
//                         async (error) => {
//                             if (error)
//                                  return next(error);
//
//                             const body = { _id: user._id, email: user.email };
//                             const token = jwt.sign({ user: body }, 'TOP_SECRET');
//
//                             return res.json({ token });
//                         }
//                     );
//                 } catch (error) {
//                     return next(error);
//                 }
//             }
//         )(req, res, next);
//     }
// );
//



















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
