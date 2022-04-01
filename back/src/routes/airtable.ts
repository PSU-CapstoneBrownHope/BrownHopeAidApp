import airtable from 'airtable';
import Router from 'express';
require('dotenv').config();

const airtableapikey = process.env.AIR_TABLE_KEY;
const baseid = process.env.BASE_ID;

const base = new airtable({apiKey: airtableapikey}).base(baseid);

const airtableRouter = Router();

airtableRouter.get('/', (req, res, next) => {
    res.sendStatus(200)
})

airtableRouter.post('/application_status', (req, res, next) => {
    const passphrase = req.body.human_readable_passphrase;
    base('Human Readable Passphrases').select({
        maxRecords: 1,
        view: "Grid view"
    }).eachPage(function page(records, fetchNextPage){
        records.forEach(function(record){
            if(record.get('Passphrase') == passphrase){
                console.log(record.get('FR Record ID'))
            }
        })

        fetchNextPage();

    }, function done(err){
        if(err) {console.log(err); return}
    });
    res.sendStatus(201)
})

export default airtableRouter;