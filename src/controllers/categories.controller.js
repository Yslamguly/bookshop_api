const db = require('../../config/db')

exports.getCategories = (req,res)=>{
    db.select('*').from('bookstore.categories')
        .then(data=>res.json(data))
        .catch(()=>res.status(500).json({message:'Internal server error'}))
}
