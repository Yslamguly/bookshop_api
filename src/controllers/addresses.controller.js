const db = require('../../config/db')

exports.addUserAddress= (req,res)=>{
    const customer_id = req.user[0].id;
    const{address_line,city,region,postal_code,country_id} = req.body;
    db.transaction(trx => {
        trx.insert({
            address_line:address_line,
            city:city,
            region:region,
            postal_code:postal_code,
            country_id:country_id}).into('bookstore.addresses').returning('id')
            .then(address=>{
                return trx('bookstore.customer_addresses')
                    .returning('*')
                    .insert({
                        customer_id:customer_id,
                        address_id:address[0].id
                    }).then(res.status(200).json({message:'Successfully added address'}))
            })
            .then(trx.commit)
            .catch(trx.rollback)
    })
        .catch(() => res.status(400).json({message:'unable to add address'}))
        .catch(err=>res.status(500).json({message:err}))
}

exports.getUserAddresses = (req,res)=>{
    const customer_id = req.user[0].id;
    const address_id = db.select('address_id').from('bookstore.customer_addresses')
                       .leftJoin('bookstore.customers',function(){this.on('customer_addresses.customer_id','=','customers.id')})
        .where('customers.id','=',customer_id)

    db.select('address_line','city','region','postal_code','countries.country_name')
      .from('bookstore.addresses')
      .join('bookstore.countries',function(){this.on('addresses.country_id','=','countries.id')})
      .whereIn('addresses.id',address_id)
      .then(data=>{data.length ? res.json(data) : res.status(200).json('You have no addresses')})
      .catch(()=>res.status(500).json({message:'Internal server error'}))

    //SQL
    // select a.address_line ,a.city,a.region,a.postal_code,c2.country_name
    // from addresses a join countries c2 on a.country_id  = c2.id
    // where a.id in (select address_id from customer_addresses ca2 left join customers c on ca2.customer_id = c.id where c.id = {customer_id})
}
exports.deleteUserAddress = (req,res)=>{

}
