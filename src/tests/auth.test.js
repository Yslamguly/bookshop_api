const request = require('supertest')
const app = require('../server')
describe('Login endpoint', () => {
    it('should return status of 401 for invalid password',async ()=>{
        const res = await request(app)
            .post('/customers/login')
            .send({
                email_address: '28@gmail.com',
                password: 'wrong password',
            })
        expect(res.statusCode).toEqual(401)
    })

    it('should return status of 401 for email that does not exist in db',async ()=>{
        const res = await request(app)
            .post('/customers/login')
            .send({
                email_address: '28dsds@gmail.com',
                password: 'wrong password',
            })
        expect(res.statusCode).toEqual(401)
    })

    it('should login a user and return object with a token key', async () => {
        const res = await request(app)
            .post('/customers/login')
            .send({
                email_address: '28@gmail.com',
                password: 'Qwerty123',
            })
        expect(res.statusCode).toEqual(200)
        expect(res.body).toHaveProperty('token')
    })
})


// describe('Register endpoint',()=>{
//     it('should return status code of 400 and object with key "first_name" if first name field is not filled in',async ()=>{
//         const res = await request(app)
//             .post('/customers/register')
//             .send({
//                 first_name:"",
//                 last_name:"Pirgulyyev",
//                 email_address:"testJWT@gmail.com",
//                 phone_number:"99364063575",
//                 password:"Qwerty123",
//                 confirm_password:"Qwerty123"
//             })
//         expect(res.statusCode).toEqual(400)
//         expect(res.body).toHaveProperty('first_name')
//     })
//     it('should return status code of 400 and object with key "last_name" if last name field is not filled in',async ()=>{
//         const res = await request(app)
//             .post('/customers/register')
//             .send({
//                 first_name:"Islam",
//                 last_name:"",
//                 email_address:"testJWT@gmail.com",
//                 phone_number:"99364063575",
//                 password:"Qwerty123",
//                 confirm_password:"Qwerty123"
//             })
//         expect(res.statusCode).toEqual(400)
//         expect(res.body).toHaveProperty('last_name')
//     })
//     it('should return status code of 400 and object with key "email_address" if email field is not filled in',async ()=>{
//         const res = await request(app)
//             .post('/customers/register')
//             .send({
//                 first_name:"Islam",
//                 last_name:"",
//                 email_address:"",
//                 phone_number:"99364063575",
//                 password:"Qwerty123",
//                 confirm_password:"Qwerty123"
//             })
//         expect(res.statusCode).toEqual(400)
//         expect(res.body).toHaveProperty('email_address')
//     })
//     it('should return status code of 400 and object with key "password" if password  field is not filled in',async ()=>{
//         const res = await request(app)
//             .post('/customers/register')
//             .send({
//                 first_name:"Islam",
//                 last_name:"",
//                 email_address:"",
//                 phone_number:"99364063575",
//                 password:"",
//                 confirm_password:"Qwerty123"
//             })
//         expect(res.statusCode).toEqual(400)
//         expect(res.body).toHaveProperty('password')
//     })
//     it('should return status code of 409 if the email address exists in the database',async ()=>{
//         const res = await request(app)
//             .post('/customers/register')
//             .send({
//                 first_name:"Islam",
//                 last_name:"Pirgulyyev",
//                 email_address:"28@gmail.com",
//                 phone_number:"99364063575",
//                 password:"Qwerty123",
//                 confirm_password:"Qwerty123"
//             })
//         expect(res.statusCode).toEqual(409)
//     })
//
//     it('should be able to register a user and return an object with a token key',async ()=>{
//         const res = await request(app)
//             .post('/customers/register')
//             .send({
//                 first_name:"Islam",
//                 last_name:"Pirgulyyev",
//                 email_address:"28ds@gmail.com",
//                 phone_number:"99364063575",
//                 password:"Qwerty123",
//                 confirm_password:"Qwerty123"
//             })
//         expect(res.statusCode).toEqual(200)
//         expect(res.body).toHaveProperty("token")
//     })
// })
