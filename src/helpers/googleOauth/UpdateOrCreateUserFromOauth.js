const db = require('../../../config/db')
const tableName = require('../../../config/table_names.json')

exports.UpdateOrCreateUserFromOauth = async ({oauthUserInfo}) => {
    const {email} = oauthUserInfo

    const existingUser = await db.select(`${tableName.customers}.email_address`)
        .from(`${tableName.customers}`)
        .where(`${tableName.customers}.email_address`, '=', email)

    if (existingUser.length > 0) {

        return await UpdateUser({oauthUserInfo})
    } else {

        return await CreateUser({oauthUserInfo})
    }
}

async function UpdateUser({oauthUserInfo}) {
    const {
        verified_email: isVerified,
        email,
        given_name,
        family_name
    } = oauthUserInfo

    const result = await db(tableName.customers)
        .where(`${tableName.customers}.email_address`, '=', email)
        .update({
            email_address: email,
            first_name: given_name,
            last_name: family_name,
            isVerified: isVerified
        }).returning('*')

    return result[0]
}

async function CreateUser({oauthUserInfo}) {
    const {
        verified_email: isVerified,
        email,
        given_name,
        family_name
    } = oauthUserInfo
    const result = await db(tableName.customers)
        .insert({
            email_address: email,
            first_name: given_name,
            last_name: family_name,
            isVerified: isVerified
        }).returning('*')
    await  db(`${tableName.shopping_cart}`)
        .insert(
            {
                customer_id: result[0].id,
                date_created: new Date()
            })
    return result[0]
}

