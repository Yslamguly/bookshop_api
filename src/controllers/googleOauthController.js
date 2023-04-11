const {getGoogleOauthUrl} = require('../helpers/googleOauth/getGoogleOauthUrl')
const jwt = require('jsonwebtoken')
const {getGoogleUser} = require('../helpers/googleOauth/getGoogleUser')
const {UpdateOrCreateUserFromOauth} = require('../helpers/googleOauth/UpdateOrCreateUserFromOauth')


exports.getGoogleOauthUrl = (req, res) => {
    const url = getGoogleOauthUrl();
    res.status(200).json({url})
}

exports.googleOauthCallback = async (req, res) => {
    const {code} = req.query;

    const oauthUserInfo = await getGoogleUser({code})

    UpdateOrCreateUserFromOauth({oauthUserInfo})
        .then((updatedUser)=>{
            const {
                id:id,
                email_address: email_address,
                first_name: first_name,
                last_name: last_name,
                isVerified: isVerified
            } = updatedUser
            const expiry_time = req.session.cookie.originalMaxAge / 100 //6000 seconds
            jwt.sign({id,email_address,first_name,last_name,isVerified},
                process.env.JWT_SECRET,
                {expiresIn : `${expiry_time}s`}, //expires in 10 minutes
                (err,token) =>
                {
                    if(err){ return res.status(500).send(err)}
                    res.redirect(`http://localhost:3000/login?token=${token}`)
                })
        }).catch((error)=>res.status(500).send(error))
}
