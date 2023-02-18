const db = require('../../config/db')
const tableName = require('../../config/table_names.json')


exports.getBooks = (req,res)=>{
    res.json(res.paginatedBooks)
}
exports.getBookById = (req,res)=>{
    const book_id = parseInt(req.query.book_id)
    const books = 'bookstore.books'
    const authors = 'bookstore.authors'

    db.select(`${books}.id`,`${books}.isbn`,`${books}.title`,
        `${books}.publication_year`,
        `${books}.selling_price`,
        `${books}.image`,
        `${books}.quantity_in_stock`,
        `${books}.page_number`,
        `${books}.description`,
        `${authors}.first_name`,
        `${authors}.last_name`)
        .from(books)
        .leftJoin(authors,function(){this.on(`${books}.author_id`,'=',`${authors}.id`)})
        .where(`${books}.id`,'=',book_id)
        .then(data=>{data.length ? res.json(data[0]) : res.status(404).json('No such book')})
        .catch(err=>res.status(500).json({message:'Internal server error'}))
}

exports.getBestSellerBooks = (req,res)=>{
    db.raw(`select b.id, b.title,b.selling_price,b.description,b.image, a.first_name , a.last_name  ,count(*) as bookCount 
                    from ${tableName.order_item} oi join ${tableName.books} b on b.id = oi.book_id 
                    join ${tableName.authors} a on a.id = b.author_id  
                    group by b.id,a.id  order by bookCount desc limit 10`)
        .then(data=>res.json(data.rows))
        .catch(err=>res.status(500).json({message:err}))
}
// exports.getResults = (req,res)=>{
//     res.json(res.paginatedResults)
// }


