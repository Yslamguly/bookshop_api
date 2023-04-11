const {getGoogleOauthUrl} = require('../helpers/googleOauth/getGoogleOauthUrl')
const {getGoogleUser} = require('../helpers/googleOauth/getGoogleUser')
const {UpdateOrCreateUserFromOauth} = require('../helpers/googleOauth/UpdateOrCreateUserFromOauth')
const {signJwtToken} = require("../helpers/jwtTokenHandler");


exports.getGoogleOauthUrl = (req, res) => {
    const url = getGoogleOauthUrl();
    res.status(200).json({url})
}

exports.googleOauthCallback = async (req, res) => {
    const {code} = req.query;

    const oauthUserInfo = await getGoogleUser({code})

    UpdateOrCreateUserFromOauth({oauthUserInfo})
        .then((updatedUser) => {
            const expiry_time = req.session.cookie.originalMaxAge / 100 //6000 seconds
            signJwtToken(updatedUser, expiry_time)
                .then((token) => res.redirect(`http://localhost:3000/login?token=${token}`))
                .catch((e) => res.status(500).send(e))
        }).catch((error) => res.status(500).send(error))
}
