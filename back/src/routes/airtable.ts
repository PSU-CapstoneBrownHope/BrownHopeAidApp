import Router from 'express';

const airtableRouter = Router();

airtableRouter.get('/', (req, res, next) => {
    res.sendStatus(200)
})

export default airtableRouter;