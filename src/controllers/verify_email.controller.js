const db = require('../../config/db')
const tableName = require('../../config/table_names.json')
const {signJwtToken} = require("../helpers/jwtTokenHandler");

const setIsVerifiedColumnToTrue = async (id) => {
    db(tableName.customers)
        .where(`${tableName.customers}.id`, '=', id)
        .update({isVerified: true})
        .then(() => console.log('success'))
        .catch((e) => console.log(e))
}


exports.verifyEmail = async (req, res) => {
    const {verificationString} = req.body

    const result = await db.select(`${tableName.customers}.id`,
        `${tableName.customers}.email_address`,
        `${tableName.customers}.first_name`,
        `${tableName.customers}.last_name`,
        `${tableName.customers}.phone_number`,
        `${tableName.customers}.isVerified`,
        `${tableName.customers}.verification_string`)
        .from(`${tableName.customers}`)
        .where(`${tableName.customers}.verification_string`, '=', verificationString)

    await setIsVerifiedColumnToTrue(result[0].id)

    const expiry_time = req.session.cookie.originalMaxAge / 100 //6000 seconds
    await signJwtToken(result[0], expiry_time)
        .then((token) => res.status(200).json({token}))
        .catch((e) => res.status(500).send(e))

    console.log(result[0])
}
