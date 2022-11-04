const db = require("../../config/db");

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
function paginatedResults(model){
    return async (req,res,next)=>{
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {}
        const row_count = await db(model).count();

        if(endIndex < parseInt(row_count[0].count)){
            results.next = {
                page: page+1,
                limit: limit
            }
        }

        if(startIndex > 0){
            results.previous = {
                page: page - 1,
                limit: limit
            }
        }
        await db.select("*").from(model).limit(limit).offset(startIndex)
            .then(data=>results.results = data)
            .catch(err=>res.status(500).json({message:err}))
        res.paginatedResults = results
        next()
    }
}

module.exports = {checkAuthenticated,checkNotAuthenticated,paginatedResults}
