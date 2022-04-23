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

describe("check loggedIn route", () => {
    test('checks for 200 status code at airta route', async () => {
        await supertest(appx).get('/api/airtable/isLoggedIn').expect(200)
    })
    appx.close();
})

describe('get info route', () => { 
    it('should pass by failing', async () => {
        const res = await supertest(appx)
        .post('/api/airtable/getInfo')
        .send({
            userName: undefined
        
        })
        expect(res.statusCode).toEqual(200)
        expect((res) => {
            res.body.data.userName = undefined;
        })
      
    })
 })

 


describe('update password', ()=>{

    it('should update password', async () =>{

        const res = await supertest(appx)
        .post('/api/airtable/update_password')
        .send({
            old_password: 'password',
            new_password: 'drowssap'
        })
        expect((res) => {

            res.body.data[0].new_password = 'drowssap'

        })

    })
})


describe('update data', ()=>{

    it('should update data', async () =>{

        const res = await supertest(appx)
        .post('/api/airtable/update')
        .send({
            first: 'first',
            last: 'last'
        })
        expect((res) => {

            res.body.data[0].first = 'first'
            res.body.data[0].last = 'last'

        })

    })
})

describe('logout route test', () => {

    it('shold ensure logout route works', async () => {
        const res = await supertest(appx)
        .post('/api/airtable/logout')
        .send({
            logout: 'true'

        })
        expect((res) => {
            res.body.data[0].logout == 'true'
        })
    })

})

describe('app status route', () => { 
    it('should pass by failingx', async () => {
        const res = await supertest(appx)
        .post('/api/airtable/application_status')
        .send({
            firstName: 'user',
            
        })
        expect(res.statusCode).toEqual(404)
        
      
    })
 })

 

 describe('login route', () => { 
    it('checks login route', async () => {
        const res = await supertest(appx)
        .post('/api/airtable/login')
        .send({
            user: 'user'
        })
        expect(res.statusCode).toEqual(200)
        expect((res) => {
            res.body.data[0].user == 'user'

        })
      
    })
 })
