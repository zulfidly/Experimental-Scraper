import Airtable from 'airtable'
import { schedule } from "@netlify/functions"
import publicHols from '../../public/publicholiday.json'

Airtable.configure({ endpointUrl: 'https://api.airtable.com', apiKey: process.env.AT_TOKEN });
var base = new Airtable.base(process.env.AT_BASE_ID);

const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const phSplit = publicHols.map((x)=> { return x.date.split("-") })

const handler = async function(event, context) {
    console.log("Netlify scheduled function running");
    await runner()
    return { statusCode: 200 };
};
// Netlify: Every 15 minutes, starting at 1 minutes past the hour, between 06:00 PM and 06:59 PM (Times shown in UTC)
// exports.handler = schedule("1/15 18 * * *", handler);   //“At every 15th minute from 1 through 59 past hour 18.”  https://crontab.guru/

// Netlify: Every 15 minutes, starting at 1 minutes past the hour (Times shown in UTC)
exports.handler = schedule("1/15 * * * *", handler);   //“At every 15th minute from 1 through 59.”  https://crontab.guru/

async function runner() {
    let timedate = recalibrateClockForMsiaOfficeHours()           
    // let timedate = new Date()    
    let hour = timedate.getUTCHours().toString().padStart(2, 0)
    let minute = timedate.getUTCMinutes().toString().padStart(2, 0)
    let day = days[timedate.getUTCDay()]                // Mon - Sun
    let date = timedate.getUTCDate().toString().padStart(2, 0)
    let month = (timedate.getUTCMonth() + 1).toString().padStart(2, 0)
    let year = timedate.getUTCFullYear().toString().padStart(2, 0)
    let second = timedate.getUTCSeconds().toString().padStart(2, 0)
    console.log(day, ':', date +'-'+ month +'-'+ year, '  > Time :', hour +':'+ minute +':'+ second, '|', timedate );   
    if(isWeekendOrPH(day, date, month, year)) return
    else {
        let datetemp = year +'-'+ month +'-'+ date
        let timetemp = hour +':'+ minute +':'+ second
        getRawData(day, datetemp, timetemp)
    }
}

async function addEntryToTable(entry) {
    console.log('adding entry to Airtable');
    base(process.env.AT_TABLE1_ID)
    .create([entry],
        function(err, records) {
            let cnt = 0
            const tester = setInterval(()=> {
                cnt++
                console.log(cnt, 'setInterval => ERR:', err, '| RECORDS', records);

                if (err) {
                    clearInterval(tester)
                    console.error('ADD ENTRY ERROR', err, 'record error:', records);
                }
                else if(!err) {
                    records.forEach(function (record) {
                        console.log('entrY added:', record.getId());
                        clearInterval(tester)
                    });
                }
                else {
                    console.log('Pending for data entry');
                }
            }, 1000)
        }
    )
}
// let promise1 = new Promise(function(resolve, reject) {
//     base(process.env.AT_TABLE1_ID)
//     .create([entry],
//         function(err, records) {
//             if (err) {
//                 console.error('ERROR adding entry:', err);
//                 reject(`ERROR adding entry: ${err}`)
//                 return;
//             }
//             resolve( records.forEach(function (record) { console.log('SUCCESSFUL entry:', record.getId()) }) )
//         }
//     )
// })

async function getRawData(dayQSE, dateQSE, timeQSE) {
    return await fetch("https://www.bursamalaysia.com/bm/trade/trading_resources/listing_directory/company-profile?stock_code=1155")
       .then((response) => response.text())
       .then(async(data) => {
            let entry = {
                "fields": {
                  "Date": dateQSE,
                  "Day": dayQSE,
                  "Time24h": timeQSE,
                  "PreviousClose": previousClose(data),
                  "LastDone": lastDone(data),
                  "Open": getOpen(data),
                  "High": getHigh(data),
                  "Low": getLow(data),
                  "JSON": undefined,
                  "servClock": new Date(),
                }
            } 
            entry.fields.JSON = JSON.stringify(entry)
            console.log('entrY :', entry);
            await addEntryToTable(entry) 
        })
       .catch((err)=> console.log('fetchERROR:', err))
};

function getOpen(x) {
    let str = '<th scope="row">Open</th>'
    let strLength = str.length
    let start = x.indexOf(str) + strLength + 1
    let end = start + 17
    let open = x.slice(start, end).trim()
    let openClean = open.replace(/[A-Z<>"='/]/ig,'').trim()
    if(Number(openClean)) return openClean.toString()
    else return 'invalid'
    // console.log('Open is :', open, open.length)
    //   console.log('OpenClean is :', openClean, openClean.length)
}

function lastDone(x) {
    let str = '<span class="down"></span>'    // or use <span class="down"></span>, friday uses down
    let strLength = str.length
    let start = x.indexOf(str) + strLength - 0
    let end = start + 10
    let lastDone = x.slice(start, end).trim()
    let lastDoneClean = lastDone.replace(/[A-Z<>"='/]/ig,'').trim()
    if(Number(lastDoneClean)) return lastDoneClean.toString()
    else {
        let str = '<span class="up"></span>'    // or use <span class="down"></span>
        let strLength = str.length
        let start = x.indexOf(str) + strLength - 0
        let end = start + 10
        let lastDone = x.slice(start, end).trim()
        let lastDoneClean = lastDone.replace(/[A-Z<>"='/]/ig,'').trim()
        if(Number(lastDoneClean)) return lastDoneClean.toString()
        else return 'invalid'
    }
}

function previousClose(x) {
    let str = '<th class="w-50" scope="row">LACP</th>'
    let strLength = str.length
    let start = x.indexOf(str) + strLength + 16
    let end = start + 11
    let prevClose = x.slice(start, end).trim()
    let prevCloseClean = prevClose.replace(/[A-Z<>"=/']/ig,'').trim()
    if(Number(prevCloseClean)) return prevCloseClean.toString()
    else return 'invalid'
    // console.log('PreviousClose is :', prevClose, prevClose.length)
    //   console.log('prevCloseClean is :', prevCloseClean, prevCloseClean.length);
}

function getHigh(x) {
    let str = '<th scope="row">High</th>'
    let strLength = str.length
    let start = x.indexOf(str) + strLength + 0
    let end = start + 11
    let high = x.slice(start, end).trim()
    let highClean = high.replace(/[A-Z<>"=/']/ig,'').trim()
    if(Number(highClean)) return highClean.toString()
    else return 'invalid'
    // console.log('high is :', high, high.length)
    // console.log('highClean is :', highClean, highClean.length);
}

function getLow(x) {
    let str = '<th scope="row">Low</th>'
    let strLength = str.length
    let start = x.indexOf(str) + strLength + 0
    let end = start + 11
    let low = x.slice(start, end).trim()
    let lowClean = low.replace(/[A-Z<>"=/']/ig,'').trim()
    if(Number(lowClean)) return lowClean.toString()
    else return 'invalid'
    // console.log('low is :', low, low.length)
    // console.log('lowClean is :', lowClean, lowClean.length);
}

////////////////////////////////////////////////////////////////////////////////////////

function recalibrateClockForMsiaOfficeHours() {
    let servCl = Date.now()
    // console.log(new Date(servCl));
    let offset = 480 * 60 * 1000            // offset is -480 minutes against UTC
    let newCl = servCl + offset
    // console.log('newCl:', new Date(newCl));
    return new Date(newCl)
}

function isWeekendOrPH(dayCurr, dateCurr, monthCurr, yearCurr) {
    let isWeekend = dayCurr=='Sat'||dayCurr=='Sun' ? true : false
    let isPH = false

    phSplit.forEach((obj, ind)=> {
        let temp = undefined
        let datePH = obj[0].padStart(2,0)
        let mthPH  = obj[1].padStart(2,0)
        let yearPH = obj[2].padStart(2,0)
        if(dateCurr===datePH && monthCurr===mthPH && yearCurr===yearPH) temp = true         // here is where the PH dates matched in JSON PH                     
        else temp = false
        isPH = temp||isPH        
    })
    if(isPH||isWeekend) console.log('it\'s isWeekendOrPH Day');
    return isPH||isWeekend
}


