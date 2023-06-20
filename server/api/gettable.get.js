import Airtable from 'airtable'

export default defineEventHandler(async(event) => {
    return await readTable1()
}) 

export async function readTable1() {
    Airtable.configure({ endpointUrl: 'https://api.airtable.com', apiKey: process.env.AT_TOKEN });
    var base = new Airtable.base(process.env.AT_BASE_ID);

    let promise = new Promise(function(resolve, reject) {
        base(process.env.AT_TABLE1_ID).select({
            view: 'Grid view'
        }).firstPage(function(err, records) {
            if (err) { console.error(err)
                reject(err)
            } else {
                let temp = []
                records.forEach(function(record, ind) {                    
                    temp.push(record._rawJson)
                });
                resolve(temp)
            }
        });
    })
    return await promise
}
