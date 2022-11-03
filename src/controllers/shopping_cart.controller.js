const db = require('../../config/db')

exports.getUserShoppingCart = (req,res)=>{
    const customer_id = req.user[0].id;
    const shopping_cart = 'bookstore.shopping_cart'

    db.select('id','isbn','author','title','publication_year','selling_price','image')
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

exports.addBookToShoppingCart = (req,res)=>{
    const{book_id} = req.body;
    const customer_id = req.user[0].id;
    db.raw(`insert into bookstore.shopping_cart_item (cart_id, book_id ) 
        SELECT shopping_cart.id, books.id 
        FROM   
        (SELECT id 
        FROM   bookstore.shopping_cart 
        WHERE  customer_id = ${customer_id}) AS shopping_cart, 
        (SELECT id
        FROM   bookstore.books
        WHERE  id = ${book_id}) AS books`)
        .then(data=>res.status(201).json('Book has been added successfully'))
        .catch(err=>res.status(400).json('This book is already in your cart'))
}

exports.deleteBookFromShoppingCart = (req,res)=>{
    const{shopping_cart_item_book_id} = req.body;
    const customer_id = req.user[0].id;
    const shopping_cart_id = db.select('id').from('bookstore.shopping_cart').where('customer_id','=',customer_id)
    const book_id = db.select('id').from('bookstore.books').where('id','=',shopping_cart_item_book_id)

    db('bookstore.shopping_cart_item')
        .where('cart_id','=',shopping_cart_id)
        .andWhere('book_id','=',book_id)
        .del()
        .then(response=>res.status(200).json('Book has been deleted successfully'))
        .catch(err=>res.status(400).json(err))
}
