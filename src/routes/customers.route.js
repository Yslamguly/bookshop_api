const express = require('express');
const router = express.Router();
const customersController = require('../controllers/customers.controller')


router.post('/register',customersController.register);
router.post('/login',customersController.login)

module.exports = router;






// router.get('/login',auth.checkAuthenticated,customersController.login)
//
// router.post('/login',passport.authenticate("local", {
//         successReturnToOrRedirect: "/home",
//         failureRedirect: 'login',
//         failureFlash: true,
//         successFlash: 'Successful!'
//     }))
// router.get('/login/federated/google', customersController.signinGoogle);
// router.get('/oauth2/redirect/google',customersController.googleCallback);
// router.get('/',customersController.test);
// router.get('/home',auth.checkNotAuthenticated,customersController.home)
