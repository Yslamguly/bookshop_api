const db = require('../../config/db')


const tableName = {
    sci : 'bookstore.shopping_cart_item',
    sc : 'bookstore.shopping_cart',
    books : 'bookstore.books',
    authors : 'bookstore.authors',
    addresses : 'bookstore.addresses',
    customer_addresses : 'bookstore.customer_addresses',
    customers : 'bookstore.customers',
    countries:'bookstore.countries'
}

exports.addAddress = (customer_id,address_line,city,region,postal_code)=>{
    return db.transaction(trx => {
        trx.insert({
            address_line:address_line,
            city:city,
            region:region,
            postal_code:postal_code}).into(tableName.addresses).returning('id')
            .then(address=>{
                return trx(tableName.customer_addresses)
                    .returning('*')
                    .insert({
                        customer_id:customer_id,
                        address_id:address[0].id
                    }).then()
            })
            .then(trx.commit)
            .catch(trx.rollback)
    }).then()
        .catch(err=>console.log(err))
}

exports.getUserAddresses = (req,res)=>{
    const customer_id = req.user[0].id;
    const address_id = db.select('address_id').from(tableName.customer_addresses)
                       .leftJoin(tableName.customers,function(){this.on(`${tableName.customer_addresses}.customer_id`,'=',`${tableName.customers}.id`)})
        .where(`${tableName.customers}.id`,'=',customer_id)

    db.select('address_line','city','region','postal_code',`${tableName.countries}.country_name`,`${tableName.customer_addresses}.id as customer_addresses_id`)
      .from(tableName.addresses)
      .join(tableName.countries,function(){this.on(`${tableName.addresses}.country_id`,'=',`${tableName.countries}.id`)})
      .join(tableName.customer_addresses,function(){this.on(`${tableName.addresses}.id`,'=',`${tableName.customer_addresses}.address_id`)})
      .whereIn(`${tableName.addresses}.id`,address_id)
      .then(data=>{data.length ? res.json(data) : res.status(200).json('You have no addresses')})
      .catch(()=>res.status(500).json({message:'Internal server error'}))

    //SQL
    // select a.address_line ,a.city,a.region,a.postal_code,c2.country_name
    // from addresses a join countries c2 on a.country_id  = c2.id
    // where a.id in (select address_id from customer_addresses ca2 left join customers c on ca2.customer_id = c.id where c.id = {customer_id})
}



// exports.addUserAddress= (req,res)=>{
//     const customer_id = req.user[0].id;
//     const{address_line,city,region,postal_code,country_id} = req.body;
//     db.transaction(trx => {
//         trx.insert({
//             address_line:address_line,
//             city:city,
//             region:region,
//             postal_code:postal_code,
//             country_id:country_id}).into(tableName.addresses).returning('id')
//             .then(address=>{
//                 return trx(tableName.customer_addresses)
//                     .returning('*')
//                     .insert({
//                         customer_id:customer_id,
//                         address_id:address[0].id
//                     }).then(res.status(200).json({message:'Successfully added address'}))
//             })
//             .then(trx.commit)
//             .catch(trx.rollback)
//     })
//         .catch(() => res.status(400).json({message:'unable to add address'}))
//         .catch(err=>res.status(500).json({message:err}))
// }
