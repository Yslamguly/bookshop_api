const jwt = require('jsonwebtoken');

exports.signJwtToken = (body, expiry_time) => {
    return new Promise((resolve, reject) => {
        jwt.sign(body,
            process.env.JWT_SECRET,
            {expiresIn: `${expiry_time}s`}, //expires in 10 minutes
            (err, token) => {
                if (err) {
                    return reject(err)
                }
                return resolve(token)
            }
        )
    })
}
