import Airtable from 'airtable'

export default defineEventHandler(async(event) => {
    return await readTable1()
}) 

async function readTable1() {
    Airtable.configure({ endpointUrl: 'https://api.airtable.com', apiKey: process.env.AT_TOKEN });
    var base = new Airtable.base(process.env.AT_BASE_ID);
    let temp = []
    let promise = new Promise(function(resolve, reject) {
        base(process.env.AT_TABLE1_ID).select({
            view: 'Grid view'
        })
        .eachPage(function page(records, fetchNextPage) {
                records.forEach(function(record, ind) {                    
                    temp.push(record._rawJson)
                });
                fetchNextPage()
        }, 
        function done(err) {  
            if(err) {
                console.log(err);
                reject(err)
            }
            else {
                resolve(temp)
            }
        });
    })
    return await promise
}
