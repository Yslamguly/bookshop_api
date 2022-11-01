function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/home");
    }
    next();
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.redirect("/customers/login");
    res.status(401).json('Please, login first')
}

module.exports = {checkAuthenticated,checkNotAuthenticated}
