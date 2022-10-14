const validatePassword = (password,confirm_password,errors)=>{
    const regExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;
    if(confirm_password!==password){
        errors.push('Password and confirm password do not match.')
        return;
    }
    if(password.match(regExp)){
        return;
    }
    else{
        errors.push('The password should be between 6 to 20 characters which contains at least one numeric digit, one uppercase and one lowercase letter')
    }
}

module.exports = {validatePassword};
