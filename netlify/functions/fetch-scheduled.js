import { schedule } from "@netlify/functions"
import Airtable from 'airtable'
import publicHols from '../../public/publicholiday.json'

const handler = async function(event, context) {
    console.log("fetch scheduled function");
    return await fetch("https://www.malaysiastock.biz/Corporate-Infomation.aspx?securityCode=0166")
    .then((response) => response.text())
    .then(async(data) => {
        Airtable.configure({ endpointUrl: 'https://api.airtable.com', apiKey: process.env.AT_TOKEN });
        var base = new Airtable.base(process.env.AT_BASE_ID);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        const phSplit = publicHols.map((x)=> { return x.date.split("-") })
        const regex = new RegExp(/["A-Z_=:;<\/>"']/, 'ig')
        let timedate = recalibrateClockForMsiaOfficeHours()           
        let hour = timedate.getUTCHours().toString().padStart(2, 0)
        let minute = timedate.getUTCMinutes().toString().padStart(2, 0)
        let day = days[timedate.getUTCDay()]                // Mon - Sun
        let date = timedate.getUTCDate().toString().padStart(2, 0)
        let month = (timedate.getUTCMonth() + 1).toString().padStart(2, 0)
        let year = timedate.getUTCFullYear().toString().padStart(2, 0)
        let second = timedate.getUTCSeconds().toString().padStart(2, 0)
        console.log(day, ':', date +'-'+ month +'-'+ year, '  > Time :', hour +':'+ minute +':'+ second, '|', timedate );   
        if(isWeekendOrPH(date, month, year)) return
        else {
            let datetemp = year +'-'+ month +'-'+ date
            let timetemp = hour +':'+ minute +':'+ second
            return await getRawData(day, datetemp, timetemp, data)
        }    

        async function getRawData(dayQSE, dateQSE, timeQSE, info) {
            let entry = {
                "fields": {
                    "Date": dateQSE,
                    "Day": dayQSE,
                    "Time24h": timeQSE,
                    "PreviousClose": previousClose(info),
                    "LastDone": lastDone(info),
                    "Open": getOpen(info),
                    "DayRange": getDaysRange(info),
                    "JSON": undefined,
                    "servClock": new Date(),
                }
            } 
            entry.fields.JSON = JSON.stringify(entry)
            console.log('entrY :', entry);
            return await addEntryToTable(entry) 
        };

        async function addEntryToTable(entry2) {
            let promis = new Promise(function(resolve, reject) {
                base(process.env.AT_TABLE1_ID)
                .create([entry2],
                    function(err, records) {        
                        if (err) {
                            console.error('ADD ENTRY ERROR', err, 'record error:', records||'noRecordError');
                            reject(err)
                        } else {
                            records.forEach(function (record) {
                                console.log('entrY added:', record.getId());
                                resolve({ statusCode: 200, body: JSON.stringify({ entry: record.getId() }) })
                            });
                        }
                    }
                )
            })
            return await promis
        }        
        
        function getOpen(x) {
            let str = '<label id="MainContent_lbQuoteOpen" style="font-size:15px;  font-weight:bold; color:#333;">'
            let strLength = str.length
            let start = x.indexOf(str) + strLength
            let end = start + 8 
            let open = x.slice(start, end).trim()
            let openClean = open.replace(regex,'').trim()
            if(Number(openClean)) return openClean.toString()
            else return 'invalid'
        }
        
        function lastDone(x) {
            let str = 'id="MainContent_lbQuoteLast"'    // 2 classes here i.e class="RedQoute" or class="GreenQuote"
            let strLength = str.length
            let start = x.indexOf(str) + strLength
            let end = start + strLength + 30
            let lastDone = x.slice(start, end).trim()
            let lastDoneClean = lastDone.replace(regex,'').trim()
            if(Number(lastDoneClean)) return lastDoneClean.toString()
            else return 'invalid'
        }
        
        function previousClose(x) {
            let str = '<label id="MainContent_lbQuoteRef" style="font-size:15px;  font-weight:bold; color:#333;">'
            let strLength = str.length
            let start = x.indexOf(str) + strLength 
            let end = start + 8
            let prevClose = x.slice(start, end).trim()
            let prevCloseClean = prevClose.replace(regex,'').trim()
            if(Number(prevCloseClean)) return prevCloseClean.toString()
            else return 'invalid'
        }
        function getDaysRange(x) {
            let str = '<label id="MainContent_lbDayRange" style="font-size:15px;  font-weight:bold; color:#333;">'
            let strLength = str.length
            let start = x.indexOf(str) + strLength + 0
            let end = start + 14
            let dayRange = x.slice(start, end).trim()
            let dayRangeClean = dayRange.replace(/["A-Z_=:;<\/>"']/ig,'').trim()
            return dayRangeClean
            // if(Number(dayRangeClean)) return dayRangeClean.toString()
            // else return 'invalid'
        }        
        
        function recalibrateClockForMsiaOfficeHours() {
            let servCl = Date.now()
            let offset = 480 * 60 * 1000            // fixed offset; is -480 minutes against UTC (GMT +0)
            let newCl = servCl + offset
            return new Date(newCl)
        }
        
        function isWeekendOrPH(dateCurr, monthCurr, yearCurr) {
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

            if(isPH) {
                let entryPH = {
                    "fields": {
                        "Date": year +'-'+ month +'-'+ date,
                        "Day": "PH",
                        "Time24h": "-",
                        "PreviousClose": "-",
                        "LastDone": "-",
                        "Open": "-",
                        "DayRange": "-",
                        "JSON": "-",
                        "servClock": new Date(),
                    }
                } 
                addEntryToTable(entryPH)
            }
            return isPH
        }  
    }) // then() ends
    .catch((err)=> {
        console.log('fetchERROR:', err)
        return { statusCode: 500, body: JSON.stringify({ error: 'finally promise settled'}) }
    })
    .finally(()=> { 
        console.log('finally() running'); 
        return {
            statusCode: 200, 
            body: JSON.stringify({msg:'finally promise settled'})
        }
    })

};
// exports.handler = schedule("12 * * * *", handler);   
exports.handler = schedule("30 18 * * 1-5", handler);   // Standard cron: “At 18:30 on every day-of-week from Monday through Friday.”