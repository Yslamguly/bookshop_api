const request = require('supertest')
const app = require('../server')

async function login() {
    return await request(app)
        .post('/customers/login')
        .send({
            email_address: '28@gmail.com',
            password: 'Qwerty123',
        })
}
/**
 * This function takes an optional parameter which can be null or undefined.
 * @param {number|null|undefined} book_id - The optional parameter.
 * @param {Object} token
 */
async function deleteBook(book_id,token){
    return await request(app).delete('/shopping_cart/deleteBook/58')
        .send({
            shopping_cart_item_book_id: book_id
        })
        .set('Authorization', `Bearer ${token.body.token}`)
}
/**
 * This function takes an optional parameter which can be null or undefined.
 * @param {number|null|undefined} book_id - The optional parameter.
 * @param {number|null|undefined} quantity
 * @param {number|null|undefined} total_price
 * @param {Object} token
 */
async function updateBookQuantity(book_id,quantity,total_price,token){
    return await request(app).patch('/shopping_cart/updateQuantity/58')
        .send({
            book_id,
            quantity,
            total_price
        })
        .set('Authorization', `Bearer ${token.body.token}`)
}

async function addBook(token) {
    return await request(app)
        .post('/shopping_cart/addBook/58')
        .send({
            book_id: 14,
            price: 60
        }).set('Authorization', `Bearer ${token.body.token}`)
}

describe('get user shopping cart', () => {
    it(`should return a list of books in user's shopping cart`, async () => {
        const token = await login()
        const res = await request(app)
            .get('/shopping_cart/58')
            .set('Authorization', `Bearer ${token.body.token}`)

        expect(res.statusCode).toEqual(200)
    })
    it('should return a status code of 403 because token is not provided', async () => {
        const res = await request(app)
            .get('/shopping_cart/58')

        expect(res.statusCode).toEqual(403)
    })
})

describe('add a book to user shopping cart', () => {

    it(`should return a status code of 403 because token is not provided`, async () => {
        const res = await request(app)
            .post('/shopping_cart/addBook/58')
            .send({
                book_id: 14,
                price: 60
            })

        expect(res.statusCode).toEqual(403)
    })
    it(`should return a status code of 409 because a books is added twice`, async () => {
        const token = await login()

        await addBook(token)
        const res = await addBook(token)

        await deleteBook(token)

        expect(res.statusCode).toEqual(409)
    })
})

describe(`delete a book from user's shopping cart`,()=>{
    it('should return a status code of 400 if book_id is not provided',async()=>{
        const token =  await login()
        await addBook(token)

        const res = await deleteBook(null,token)

        expect(res.statusCode).toEqual(400)

    })
    it('should return a status code of 200 if book has been deleted successfully',async()=>{
        const token = await login()

        await addBook(token)

        const res = await deleteBook(14,token)

        expect(res.statusCode).toEqual(200)


    })
})

describe(`update a book quantity in shopping cart`,()=>{
    it('should return a status code of 400 if book_id or total_price or quantity is missing',async()=>{
        const token = await login()

        await addBook(token)

        const res = await  updateBookQuantity(null,2,94,token)


        expect(res.statusCode).toEqual(400)
    })
    it('should return a status code of 200 and a object with message key if book quantity has been updated successfully',async ()=>{
        const token = await login()

        await addBook(token)

        const res = await  updateBookQuantity(14,2,94,token)


        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('message')

    })

})

