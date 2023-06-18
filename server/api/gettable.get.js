import Airtable from 'airtable'
export default defineEventHandler(async(event) => {
    // console.log('Obj :', await readTest());
    return await readTable1()
}) 

async function readTable1() {
    var base = new Airtable({apiKey: process.env.AT_TOKEN}).base(process.env.AT_BASE_ID);
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
                });
                resolve(temp)
            }
        });
    })
    return await promise
}
