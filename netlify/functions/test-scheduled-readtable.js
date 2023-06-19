import { schedule } from "@netlify/functions"
import Airtable from 'airtable'
var base = new Airtable({apiKey: process.env.AT_TOKEN}).base(process.env.AT_BASE_ID);

const handler = async function(event, context) {
    console.log("Readtable: Netlify scheduled function running");

    let promise = new Promise(function(resolve, reject) {
        base(process.env.AT_TABLE1_ID).select({
            view: 'Grid view'
        }).firstPage(function(err, records) {
            if (err) { console.error(err)
                reject(err)
                return;
            } else {
                let temp = []
                records.forEach(function(record, ind) {                    
                    temp.push(record._rawJson)
                    console.log('firstPage OK:', temp);
                });
                resolve(temp)
            }
        });
    })
    return await promise
    // return {
    //     statusCode: 200,
    // };
};
exports.handler = schedule("1/5 * * * *", handler);        //“At every 10th minute from 1 through 59.”