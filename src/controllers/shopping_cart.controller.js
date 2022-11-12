const db = require('../../config/db')

exports.getUserShoppingCart = (req,res)=>{
    const customer_id = req.user[0].id;
    const shopping_cart = 'bookstore.shopping_cart'

    db.select('id','isbn','author_id','title','publication_year','selling_price','image')
        .from('bookstore.books')
        .whereIn('bookstore.books.id',function(){
            this.select('book_id').from('bookstore.shopping_cart_item')
            .leftJoin(shopping_cart,function (){
                this.on(`bookstore.shopping_cart_item.cart_id`,'=',`${shopping_cart}.id`)
            }).where(`${shopping_cart}.customer_id`,'=',customer_id)
        })
        .then(data=>{data.length ? res.json(data) : res.status(200).json({message:'You have no books in your cart'})})
        .catch(err=>res.status(500).json(err))
}

exports.addBookToShoppingCart = (req,res)=>{
    const {book_id} = req.body;
    const customer_id = req.user[0].id;
    const cart_id = db.select('id').from('bookstore.shopping_cart')
                       .where('customer_id','=',customer_id)
    db('bookstore.shopping_cart_item')
        .insert({cart_id:cart_id,book_id:book_id})
        .then(data=>res.status(201).json({message:'Book has been added successfully'}))
        .catch(err=>res.status(400).json({message:'This book is already in your cart'}))
        .catch(err=>res.status(500).json({message:err}))
}

exports.updateBookQuantity = (req,res)=>{
    const {book_id,quantity} = req.body;
    const customer_id = req.user[0].id;
    const cart_id = db.select('id').from('bookstore.shopping_cart')
                   .where('customer_id','=',customer_id)

    db('bookstore.shopping_cart_item')
        .where('cart_id','=',cart_id)
        .andWhere('book_id','=',book_id)
        .update({quantity:quantity})
        .then(res.status(200).json({message:'Success'}))
        .catch(err=>res.status(500).json(err))
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
        .then(response=>res.status(200).json({message:'Book has been deleted successfully'}))
        .catch(err=>res.status(500).json(err))
}
