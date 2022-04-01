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
    
    let get_record_id = new Promise((resolve,reject) => {
        let record_idx = null;
        
        base('Human Readable Passphrases').select({
            maxRecords: 1,
            view: "Grid view"
        }).eachPage(function page(records, fetchNextPage){
            records.forEach(function(record){
                if(record.get('Passphrase') == passphrase){
                    record_idx = record.get('FR Record ID')
                    console.log("record id: " + record_idx)
                }
            })
    
            fetchNextPage();
    
        }, function done(err){
            if(err) {console.log(err); return}
            resolve(record_idx)
        });
        


    })

    get_record_id
    .then((record_idx)=>{
      
        base('2021 Form Responses').select({filterByFormula: `{BRF 2021 Application Record ID} = '${record_idx}'`}).firstPage((err, records)=>{

            if(err){
                console.log("error: " + err);
                res.sendStatus(404)
                return;
            }else if (records.length == 1){
                console.log(records[0].fields['BRF Application Stage'])
                res.send(records[0].fields['BRF Application Stage']);  
            }else{
                console.log("error either too many records, or no record found")
                res.sendStatus(404);
            }
             
        })
       
    })
     
})

export default airtableRouter;