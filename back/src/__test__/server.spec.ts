import appx from '../server'
import supertest from 'supertest'

describe("test http server", () => {
    test('checks for 200 status code at main route', async () => {
        await supertest(appx).get('/').expect(200)
    })
    appx.close();
})

describe("test airtable route", () => {
    test('checks for 200 status code at airtable route', async () => {
        await supertest(appx).get('/api/airtable').expect(200)
    })
    appx.close();
})

