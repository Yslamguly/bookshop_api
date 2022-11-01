const db = require('../../config/db')

exports.getUserShoppingCart = (req,res)=>{
    const customer_id = req.user[0].id;
    const shopping_cart = 'bookstore.shopping_cart'
    db.select('isbn','author','title','publication_year','selling_price','image')
        .from('bookstore.books')
        .whereIn('bookstore.books.id',function(){
            this.select('book_id').from('bookstore.shopping_cart_item')
            .leftJoin(shopping_cart,function (){
                this.on(`${shopping_cart}.customer_id`,'=',customer_id)
            })
        })
        .then(data=>res.send(data))
        .catch(err=>res.status(400).send(err))
}
