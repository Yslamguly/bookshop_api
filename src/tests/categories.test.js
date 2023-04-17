const request = require('supertest')
const app = require('../server')


describe('categories endpoint',()=>{
    it('should return categories and status code of 200',async ()=>{
        const res = await request(app).get('/categories')

        expect(res.statusCode).toEqual(200)
    })
})
