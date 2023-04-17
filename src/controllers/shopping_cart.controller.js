const db = require('../../config/db')
const tableName = require('../../config/table_names.json')


exports.getUserShoppingCart = async (req,res)=>{
    const {customerId} = req.params;


    await db.select(`${tableName.books}.id`,`${tableName.books}.isbn`,`${tableName.books}.title`,`${tableName.books}.publication_year`,`${tableName.books}.selling_price`,`${tableName.books}.image`,
        `${tableName.authors}.first_name`,`${tableName.authors}.last_name`,`${tableName.shopping_cart_item}.quantity`,`${tableName.shopping_cart_item}.price`,`${tableName.shopping_cart_item}.total_price`)
        .from(tableName.books)
        .join(tableName.authors,function (){this.on(`${tableName.books}.author_id`,'=',`${tableName.authors}.id`)})
        .join(tableName.shopping_cart_item,function (){this.on(`${tableName.shopping_cart_item}.book_id`,'=',`${tableName.books}.id`)})
        .join(tableName.shopping_cart,function (){this.on(`${tableName.shopping_cart_item}.cart_id`,'=',`${tableName.shopping_cart}.id`)})
        .where(`${tableName.shopping_cart}.customer_id`,'=',customerId)
        .then(data => {data.length ? res.json(data) : res.status(200).json({message:'You have no books in your cart'})})
        .catch(err=>res.status(500).json(err))
}

exports.addBookToShoppingCart = (req,res)=>{
    const {book_id,price} = req.body;
    const {customerId} = req.params;
    const cart_id = db.select('id').from(tableName.shopping_cart)
                       .where('customer_id','=',customerId)
    db(tableName.shopping_cart_item)
        .insert({cart_id:cart_id,book_id:book_id,price:price,total_price:price})
        .then(()=>res.status(201).json({message:'Book has been added successfully'}))
        .catch(()=>res.status(409).json({message:'This book is already in your cart'}))
        .catch(err=>res.status(500).json({message:err}))
}

exports.updateBookQuantity = (req,res)=>{
    const {book_id,quantity,total_price} = req.body;
    const {customerId} = req.params;


    if(book_id === null || quantity === null || total_price === null){
        res.sendStatus(400)
    }


    const cart_id = db.select('id').from(tableName.shopping_cart)
                   .where('customer_id','=',customerId)

    db(tableName.shopping_cart_item)
        .where('cart_id','=',cart_id)
        .andWhere('book_id','=',book_id)
        .update({quantity:quantity,total_price:total_price})
        .then(()=>res.status(200).json({message:'Success'}))
        .catch(err=>res.status(500).json(err))
}


exports.deleteBookFromShoppingCart = (req,res)=>{
    const{shopping_cart_item_book_id} = req.body;
    const {customerId} = req.params;

    if(shopping_cart_item_book_id===null){
        res.sendStatus(400)
    }
    const shopping_cart_id = db.select('id').from(tableName.shopping_cart).where('customer_id','=',customerId)
    db(tableName.shopping_cart_item)
        .where('cart_id','=',shopping_cart_id)
        .andWhere('book_id','=',shopping_cart_item_book_id)
        .del()
        .then(()=>res.status(200).json({message:'Book has been deleted successfully'}))
        .catch(err=>res.status(500).json(err))
}
exports.emptyShoppingCart = (req,res)=>{
    const {customerId} = req.params;

    const cart_id = db.select('cart_id')
        .from(tableName.shopping_cart)
        .where('customer_id','=',customerId)

    db(tableName.shopping_cart_item)
        .where('cart_id','=',cart_id)
        .del()
        .then(()=>res.status(204).send())
        .catch(err=>res.status(500).json(err))
}

exports.deleteItemsFromShoppingCart = (user_id) =>{
    const cart_id = db.select('cart_id')
        .from(tableName.shopping_cart)
        .where('customer_id','=',user_id)
    db(tableName.shopping_cart_item)
        .where('cart_id','=',cart_id)
        .del()
        .then()
        .catch(err=>console.log(err))
}
