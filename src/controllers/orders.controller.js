const db = require('../../config/db')
const tableName = require('../../config/table_names.json')

exports.createShopOrder = (req, res) => {
    const customer_id = req.user[0].id

    const {customer_address_id, final_price} = req.body;
    db.transaction(trx => {
        trx.insert({
            customer_id: customer_id,
            order_date: new Date(),
            final_price: final_price,
            customer_address_id: customer_address_id
        }).into(`${tableName.shop_order}`).returning('id')
            .then(order => {
                return trx.raw(`insert into ${tableName.order_item} (shop_order_id,book_id,quantity,total_price)  
                                 select ${order[0].id} as shop_order_id,book_id,quantity,total_price 
                                 from ${tableName.shopping_cart_item} sci 
                                 join ${tableName.shopping_cart} sc  on sc.id  = sci.cart_id 
                                 where sc.customer_id = ${customer_id}`)
                    .then(res.status(200).json({message: 'Successfully created order'}))
            })
            .then(trx.commit)
            .catch(trx.rollback)
            .catch(err => res.send(err))
    }).catch(err => res.status(500).json({message: 'Internal server error'}))
}

exports.createOrder = (customer_id, final_price) => {
    return db.transaction(trx => {
        trx.insert({
            customer_id: customer_id, order_date: new Date(), final_price: final_price,
        }).into('bookstore.shop_order').returning('id')
            .then(order => {
                console.log(order)
                return trx.raw(`insert into ${tableName.order_item} (shop_order_id,book_id,quantity,total_price)  
                                 select ${order[0].id} as shop_order_id,book_id,quantity,total_price 
                                 from ${tableName.shopping_cart_item} sci 
                                 join ${tableName.shopping_cart} sc  on sc.id  = sci.cart_id 
                                 where sc.customer_id = ${customer_id}`)
                    .then()
                    .catch((err) => console.log(err))
            })
            .then(trx.commit)
            .catch(trx.rollback)
            .catch(err => console.log(err))
    }).catch(err => console.log(err))
}

exports.getUserOrders = (req, res) => {
    const {customerId} = req.params;

    db.select(`${tableName.books}.id`, `${tableName.books}.title`, `${tableName.books}.image`,
        `${tableName.authors}.first_name`, `${tableName.authors}.last_name`, `${tableName.order_item}.quantity`, `${tableName.order_item}.total_price`, `${tableName.shop_order}.order_date`)
        .from(tableName.books)
        .join(tableName.authors, function () {
            this.on(`${tableName.books}.author_id`, '=', `${tableName.authors}.id`)
        })
        .join(tableName.order_item, function () {
            this.on(`${tableName.order_item}.book_id`, '=', `${tableName.books}.id`)
        })
        .join(tableName.shop_order, function () {
            this.on(`${tableName.order_item}.shop_order_id`, '=', `${tableName.shop_order}.id`)
        })
        .where(`${tableName.shop_order}.customer_id`, '=', customerId)
        .then(data => {
            data.length ? res.json(data) : res.status(200).json({message: 'You have purchased no books'})
        })
        .catch(err => res.status(500).json(err))
}
