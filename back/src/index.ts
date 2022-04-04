
import { Router } from 'express'
import airtableRouter from './routes/airtable'

const port = 3000
const routes = Router();

routes.use('/api/airtable', airtableRouter);

export default routes;
