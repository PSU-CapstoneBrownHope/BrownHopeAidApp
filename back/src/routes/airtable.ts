import Router from 'express';

const airtableRouter = Router();

airtableRouter.get('/', (req, res, next) => {
    res.sendStatus(200)
})

airtableRouter.post('/application_status', (req, res, next) => {
    res.sendStatus(201)
})

export default airtableRouter;