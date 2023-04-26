const validatePassword = (password,confirm_password,errors)=>{
    const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(password === ""){
        return errors.password = 'Please, insert a value for password field!'
    }
    if(confirm_password === ""){
        return errors.confirm_password = 'Please, insert a value for confirm password field!'
    }
    if(confirm_password!==password){

        return errors.confirm_password = 'Password and confirm password do not match.'
    }
    if(!password.match(regExp)){
        return errors.password = 'The password should be between 6 to 20 characters which contains at least one numeric digit, one uppercase and one lowercase letter'
    }
}

const validateName = (first_name,last_name,errors)=>{
    const regExp = /^[A-Za-z]+$/;
    if(first_name === ""){
        return errors.first_name = 'Please, insert your first name!'
    }
    if(last_name === ""){
        return errors.last_name = 'Please, insert your last name!'
    }
    if(first_name?.length <= 1){
        return errors.first_name = 'It seems like you have a really short name:)'
    }
    if(last_name?.length<=1){
        return errors.last_name = 'Lastname should have at least 2 characters'
    }
    if(!first_name.match(regExp) || !last_name.match(regExp)){
         errors.first_name = 'You are allowed to insert only letters as your name!'
         errors.last_name = 'You are allowed to insert only letters as your last name!'
    }
}

const validateEmail = (email,errors)=>{
    const regExp = /^([a-zA-Z0-9\\_\\-\\.]+)@([a-zA-Z]+).(.+)$/;
    if(email === ""){
        errors.email_address = 'Email is required'
        return
    }
    if(!email.match(regExp)){
        errors.email_address = 'Please, give a correct email address'
    }
}

const validatePhoneNumber = (phone_number,errors)=>{
    const regExp = /^\d{9,11}$/;
    if(phone_number === null || phone_number === ''){
        return
    }
    if(!phone_number.match(regExp)){
        errors.phone_number = 'You can give only digits!'
    }
}

module.exports = {validatePassword,validateName,validateEmail,validatePhoneNumber};
