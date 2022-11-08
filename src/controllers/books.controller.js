const db = require('../../config/db')

exports.getBooks = (req,res)=>{
    res.json(res.paginatedBooks)
}
exports.getBookById = (req,res)=>{
    const book_id = parseInt(req.query.book_id)
    const books = 'bookstore.books'
    const authors = 'bookstore.authors'

    db.select(`${books}.id`,`${books}.isbn`,`${books}.title`,`${books}.publication_year`,`${books}.selling_price`,`${books}.image`,`${authors}.first_name`,`${authors}.last_name`)
        .from(books)
        .leftJoin(authors,function(){this.on(`${books}.author_id`,'=',`${authors}.id`)})
        .where(`${books}.id`,'=',book_id)
        .then(data=>{data.length ? res.json(data[0]) : res.status(404).json('No such book')})
        .catch(err=>res.status(500).json({message:'Internal server error'}))
}
// exports.getResults = (req,res)=>{
//     res.json(res.paginatedResults)
// }


