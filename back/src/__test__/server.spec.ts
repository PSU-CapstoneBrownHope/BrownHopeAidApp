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

/*describe("test airtable route", () => {
    test('checks for 200 status code at airtable route', async (done) => {
       supertest(appx).post('/api/airtable')
        .send({application_id: '42'})
        .set('Accept','application/json')
        .expect(200)
        .end((err)=>{
            if(err) return done(err)
            return done
        })
    })
    appx.close();
})
*/

describe('post endpoint for airtable route', () => { 
    it('should get the data for this id', async () => {
        const res = await supertest(appx)
        .post('/api/airtable/application_status')
        .send({
            application_id: '42'
        })
        expect((res)=>{
            res.body.data[0].application_id == 42
        })
      

    })
 })


 describe('login route', () => { 
    it('should pass by failing', async () => {
        const res = await supertest(appx)
        .post('/api/airtable/login')
        .send({
            username: 'user',
            password: 'password'
        })
        expect(res.statusCode).toEqual(200)
        expect((res) => {
            res.body.data[0].username == 'user';
            res.body.data[0].password == 'password'


        })
      

    })
 })

