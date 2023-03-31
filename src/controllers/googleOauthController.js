const {getGoogleOauthUrl} = require('../helpers/getGoogleOauthUrl')


exports.getGoogleOauthUrl = (req,res)=>{
    const url = getGoogleOauthUrl();
    res.status(200).json({url})
}
