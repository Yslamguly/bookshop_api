const db = require('../../config/db')

exports.getUserShoppingCart = (req,res)=>{
    const customer_id = req.user[0].id;
    const shopping_cart = 'bookstore.shopping_cart'
    const cart_id = db.select('cart_id').from('bookstore.shopping_cart_item').join('bookstore.shopping_cart',function (){
        this.on('bookstore.shopping_cart.id','=','bookstore.shopping_cart_item.cart_id')
    }).where('bookstore.shopping_cart.customer_id','=',customer_id).distinct()

    db.select('bookstore.books.id','isbn','bookstore.authors.first_name','bookstore.authors.last_name','title','publication_year','selling_price','image','bookstore.shopping_cart_item.quantity','bookstore.shopping_cart_item.price','bookstore.shopping_cart_item.total_price')
        .from('bookstore.books').join('bookstore.authors',function (){
            this.on('bookstore.authors.id','=','books.author_id')
    }).join('bookstore.shopping_cart_item',function(){
        this.on('bookstore.shopping_cart_item.book_id','=','books.id')
    })
        .whereIn('bookstore.books.id',function(){
            this.select('book_id').from('bookstore.shopping_cart_item')
            .leftJoin(shopping_cart,function (){
                this.on(`bookstore.shopping_cart_item.cart_id`,'=',`${shopping_cart}.id`)
            }).where(`${shopping_cart}.customer_id`,'=',customer_id)
        }).andWhere('bookstore.shopping_cart_item.cart_id','=',cart_id)
        .then(data=>{data.length ? res.json(data) : res.status(200).json({message:'You have no books in your cart'})})
        .catch(err=>res.status(500).json(err))
}

exports.addBookToShoppingCart = (req,res)=>{
    const {book_id,price} = req.body;
    const customer_id = req.user[0].id;
    const cart_id = db.select('id').from('bookstore.shopping_cart')
                       .where('customer_id','=',customer_id)
    db('bookstore.shopping_cart_item')
        .insert({cart_id:cart_id,book_id:book_id,price:price,total_price:price})
        .then(()=>res.status(201).json({message:'Book has been added successfully'}))
        .catch(()=>res.status(400).json({message:'This book is already in your cart'}))
        .catch(err=>res.status(500).json({message:err}))
}

exports.updateBookQuantity = (req,res)=>{
    const {book_id,quantity,total_price} = req.body;
    const customer_id = req.user[0].id;
    const cart_id = db.select('id').from('bookstore.shopping_cart')
                   .where('customer_id','=',customer_id)

    db('bookstore.shopping_cart_item')
        .where('cart_id','=',cart_id)
        .andWhere('book_id','=',book_id)
        .update({quantity:quantity,total_price:total_price})
        .then(res.status(200).json({message:'Success'}))
        .catch(err=>res.status(500).json(err))
}
exports.deleteBookFromShoppingCart = (req,res)=>{
    const{shopping_cart_item_book_id} = req.body;
    const customer_id = req.user[0].id;
    const shopping_cart_id = db.select('id').from('bookstore.shopping_cart').where('customer_id','=',customer_id)

    db('bookstore.shopping_cart_item')
        .where('cart_id','=',shopping_cart_id)
        .andWhere('book_id','=',shopping_cart_item_book_id)
        .del()
        .then(()=>res.status(200).json({message:'Book has been deleted successfully'}))
        .catch(err=>res.status(500).json(err))
}
