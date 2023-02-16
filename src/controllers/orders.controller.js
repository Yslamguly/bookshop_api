const db = require('../../config/db')

exports.createShopOrder = (req,res)=>{
    const customer_id = req.user[0].id

    const {customer_address_id,final_price} = req.body;
    db.transaction(trx=>{
        trx.insert({
            customer_id:customer_id,
            order_date:new Date(),
            final_price:final_price,
            customer_address_id:customer_address_id
        }).into('bookstore.shop_order').returning('id')
            .then(order=>{
                return trx.raw(`insert into bookstore.order_item (shop_order_id,book_id,quantity,total_price)  
                                 select ${order[0].id} as shop_order_id,book_id,quantity,total_price 
                                 from bookstore.shopping_cart_item sci 
                                 join bookstore.shopping_cart sc  on sc.id  = sci.cart_id 
                                 where sc.customer_id = ${customer_id}`)
                    .then(res.status(200).json({message:'Successfully created order'}))
            })
            .then(trx.commit)
            .catch(trx.rollback)
            .catch(err=>res.send(err))
    }).catch(err => res.status(500).json({message:'Internal server error'}))
}

exports.createOrder = (customer_id,final_price)=>{
    db.transaction(trx=>{
        trx.insert({
            customer_id:customer_id,
            order_date:new Date(),
            final_price:final_price,
        }).into('bookstore.shop_order').returning('id')
            .then(order=>{
                return trx.raw(`insert into bookstore.order_item (shop_order_id,book_id,quantity,total_price)  
                                 select ${order[0].id} as shop_order_id,book_id,quantity,total_price 
                                 from bookstore.shopping_cart_item sci 
                                 join bookstore.shopping_cart sc  on sc.id  = sci.cart_id 
                                 where sc.customer_id = ${customer_id}`)
                    .then()
            })
            .then(trx.commit)
            .catch(trx.rollback)
            .catch(err=> console.log(err))
    }).catch(err => console.log(err))
}
