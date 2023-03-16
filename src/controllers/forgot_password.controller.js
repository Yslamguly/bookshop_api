const { v4: uuidv4 } = require('uuid');
const {sendEmail} = require('../helpers/sendEmail')
const db = require('../../config/db')
const tableName = require("../../config/table_names.json");


const updatePasswordResetCode = (email,passwordResetCode)=>{
    return db(tableName.customers)
        .where(`${tableName.customers}.email_address`,'=',email)
        .update({password:passwordResetCode})
        // .then(()=>console.log('success'))
        // .catch((e)=>console.log(e))
}

exports.forgotPassword = async(req,res)=>{
    const {email} = req.params
    const passwordResetCode = uuidv4();
   await updatePasswordResetCode(email,passwordResetCode)
       .then(()=>sendEmail({
           to:email,
           from:'islamguly28@gmail.com',
           subject:'Password reset',
           text:`To update password code, click the following link: ${process.env.CLIENT_URL}/reset-password/${passwordResetCode}`
       }).catch((e)=>res.send(e)))

    res.sendStatus(200);
}
