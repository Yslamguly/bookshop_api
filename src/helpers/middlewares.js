const db = require("../../config/db");
const jwt = require('jsonwebtoken')


const verifyToken = async function(req, res, next){
    const {authorization} = req.headers
    if(!authorization){
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    }
    const token = authorization.split(' ')[1];

    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    await jwt.verify(token,process.env.JWT_SECRET, function(err, user){
        if(err) {
            return res.status(401).send('Bad Auth');
        } else {
            req.user = user;
            next();
        }
    })
}
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

        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const results = {}
        const row_count = await db(model).count();

        setNextPage(endIndex,row_count[0].count,results,page,limit)

        setPreviousPage(startIndex,results,page,limit)

        await db.select("*").from(model).limit(limit).offset(startIndex)
            .then(data=>results.results = data)
            .then(()=>res.paginatedResults = results)
            .then(()=>next())
            .catch(err=>res.status(500).json({message:err}))

    }
}

function setPreviousPage(startIndex,results,page,limit){
    if(startIndex > 0){
        results.previous = {
            page: page - 1,
            limit: limit
        }
    }
}
function setNextPage(endIndex,row_count,results,page,limit){
    if(endIndex < row_count){
        results.next = {
            page: page + 1,
            limit: limit
        }
    }
}

function paginatedBooks(){
    return async (req,res,next)=>{
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        const selling_price_from = parseInt(req.query.selling_price_from)
        const selling_price_to = parseInt(req.query.selling_price_to)
        const publication_year_from = parseInt(req.query.publication_year_from)
        const publication_year_to = parseInt(req.query.publication_year_to)
        const category_id = parseInt(req.query.category_id);
        const sort_value = req.query.sort_value
        const books = 'bookstore.books'

        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        const outcome = {}

        setPreviousPage(startIndex,outcome,page,limit)

        await db.select(`${books}.id`,`${books}.isbn`,`${books}.title`,`${books}.publication_year`,`${books}.selling_price`,`${books}.image`,'bookstore.authors.first_name','bookstore.authors.last_name')
            .from(books)
            .leftJoin('bookstore.book_category',function (){
            this.on('bookstore.book_category.book_id','=',`${books}.id`)}
        ).leftJoin('bookstore.authors',function (){
            this.on('bookstore.books.author_id','=','bookstore.authors.id')
            })
            .modify(function(queryBuilder){
            if(category_id){
                queryBuilder.where('bookstore.book_category.category_id','=',category_id)
            }
        }).andWhereBetween('selling_price',[selling_price_from,selling_price_to])
            .andWhereBetween('publication_year',[publication_year_from,publication_year_to])
            .orderBy(sort_value)
            .then((data)=>{
                setNextPage(endIndex,data.length,outcome,page,limit)
                outcome.outcome = data.slice(startIndex,endIndex)
                outcome.total_items = data.length
            })
            .then(()=>res.paginatedBooks = outcome)
            .then(()=>next())
            .catch(err=>res.status(500).json({message:err}))
    }
}
module.exports = {checkAuthenticated,checkNotAuthenticated,paginatedResults,paginatedBooks,verifyToken}
