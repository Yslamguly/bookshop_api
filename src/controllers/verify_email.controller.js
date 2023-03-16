const {sendEmail} = require('../helpers/sendEmail')
const db = require('../../config/db')
const tableName = require('../../config/table_names.json')
const jwt = require("jsonwebtoken");

exports.testEmail = async (req,res) => {
    try{
        await sendEmail({
            to:'islamguly28+test1@gmail.com',
            from: 'islamguly28@gmail.com',
            subject: "Does this work?",
            text: 'Yes it works'
        });
        res.sendStatus(200)
    }catch (e){
        console.log(e);
        res.sendStatus(500);
    }
}
const setIsVerifiedColumnToTrue = async (id) => {
    db(tableName.customers)
        .where(`${tableName.customers}.id`,'=',id)
        .update({isVerified:true})
        .then(()=>console.log('success'))
        .catch((e)=>console.log(e))
}


exports.verifyEmail = async (req,res)=>{
    const {verificationString} = req.body

    const result = await db.select(`${tableName.customers}.id`,
        `${tableName.customers}.email_address`,
        `${tableName.customers}.first_name`,
        `${tableName.customers}.last_name`,
        `${tableName.customers}.phone_number`,
        `${tableName.customers}.isVerified`,
        `${tableName.customers}.verification_string`)
        .from(`${tableName.customers}`)
        .where(`${tableName.customers}.verification_string`,'=',verificationString)

    await setIsVerifiedColumnToTrue(result[0].id)

    const expiry_time = req.session.cookie.originalMaxAge / 100 //6000 seconds
    jwt.sign(result[0],
        process.env.JWT_SECRET,
        {expiresIn : `${expiry_time}s`}, //expires in 10 minutes
        (err,token) =>
        {
            if(err){ return res.status(500).send(err)}
            res.status(200).json({token})
        })
    console.log(result[0])
}
