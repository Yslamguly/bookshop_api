require('dotenv').config();
const bcrypt = require('bcrypt');
const db = require('../../config/db')
const validations = require('../helpers/validations')
const functions = require('../helpers/functions');
const passport = require("passport");
const {v4: uuidv4} = require('uuid');
const {sendEmail} = require('../helpers/sendEmail')
const {signJwtToken} = require('../helpers/jwtTokenHandler')
const tableName = require('../../config/table_names.json')


exports.register = async (req, res) => {
    const {first_name, last_name, email_address, phone_number, password, confirm_password} = req.body;
    const errors = {}
    validations.validateName(first_name, last_name, errors);
    validations.validatePassword(password, confirm_password, errors)
    validations.validateEmail(email_address, errors)
    validations.validatePhoneNumber(phone_number, errors)
    const isEmpty = Object.keys(errors).length === 0;


    if (isEmpty) {
        const hash = await bcrypt.hash(password, 10);
        const verificationString = uuidv4();

        db.transaction(trx => {
            trx.insert({
                first_name: functions.capitalizeName(first_name),
                last_name: functions.capitalizeName(last_name),
                email_address: email_address,
                phone_number: phone_number,
                password: hash,
                isVerified: false,
                verification_string: verificationString
            }).into(`${tableName.customers}`).returning('*')
                .then(customers => {
                    return trx(`${tableName.shopping_cart}`)
                        .returning('*')
                        .insert({
                                customer_id: customers[0].id,
                                date_created: new Date()
                            }
                        ).then(async () => {
                            console.log(customers)
                            const body = {
                                id: customers[0].id,
                                email_address: customers[0].email_address,
                                first_name: customers[0].first_name,
                                last_name: customers[0].last_name,
                                phone_number: customers[0].phone_number
                            }
                            await sendEmail({
                                to: email_address,
                                from: 'islamguly28@gmail.com',
                                subject: 'Please, verify your email',
                                text: `Thanks for registering to InkwellBooks! To verify your email, click here:
                                           ${process.env.CLIENT_URL}/verify-email/${verificationString}
                                    `
                            }).catch((e) => {
                                console.log(e)
                                res.sendStatus(500)
                            })
                            const expiry_time = req.session.cookie.originalMaxAge / 100 //6000 seconds
                            await signJwtToken(body, expiry_time)
                                .then((token) => res.status(200).json({token}))
                                .catch((e) => res.status(500).send(e))
                        })
                })
                .then(trx.commit)
                .catch(trx.rollback)
        }).catch(()=> res.status(409).json({message: 'Email is invalid or already taken'}))
    } else {
        res.status(400).json(errors)
    }
}

exports.login = async (req, res, next) => {
    passport.authenticate("local", {failureFlash: true, successFlash: 'Successful!'}, (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(401).json(info);
        }
        req.logIn(user,
            {session: false}, //You set { session: false } because you do not want to store the user details in a session. You expect the user to send the token on each request to the secure routes.
            (err) => {
                if (err) {
                    res.status(500).json(info);
                }
                const body = {
                    id: user.id,
                    email_address: user.email_address,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    phone_number: user.phone_number,
                    isVerified: user.isVerified
                }
                const expiry_time = req.session.cookie.originalMaxAge / 100 //6000 seconds
                signJwtToken(body, expiry_time)
                    .then((token) => res.status(200).json({token}))
                    .catch((e) => res.status(500).send(e))
                console.log(req.session)
            })
    })(req, res, next)
}


exports.resetPassword = async (req, res) => {
    const {passwordResetCode} = req.params
    const {newPassword, confirmPassword} = req.body
    const errors = {}
    validations.validatePassword(newPassword, confirmPassword, errors)
    const isEmpty = Object.keys(errors).length === 0;
    if (isEmpty) {
        const hash = await bcrypt.hash(newPassword, 10);
        db(tableName.customers)
            .where(`${tableName.customers}.password`, '=', passwordResetCode)
            .update({password: hash})
            .then(() => res.sendStatus(200))
            .catch((e) => res.status(500).json(e))
    } else {
        res.status(400).json(errors)
    }
}
