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
    res.redirect("/customers/login");
}

module.exports = {checkAuthenticated,checkNotAuthenticated}
