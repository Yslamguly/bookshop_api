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
    if(password.match(regExp)){
        return;
    }
    else{
        return errors.password = 'The password should be between 6 to 20 characters which contains at least one numeric digit, one uppercase and one lowercase letter'
    }
}

const validateName = (first_name,last_name,errors)=>{
    if(first_name === ""){
        return errors.first_name = 'Please, insert your first name!'
    }
    if(last_name === ""){
        return errors.last_name = 'Please, insert your last name!'
    }

}


module.exports = {validatePassword,validateName};
