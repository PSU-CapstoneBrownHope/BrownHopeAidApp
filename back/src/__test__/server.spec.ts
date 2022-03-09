const appx = require('../server')
const supertest = require('supertest')

describe("test http server", () => {
    test('checks for 200 status code at main route', async () => {
        await supertest(appx).get('/').expect(200)
        
    })
})