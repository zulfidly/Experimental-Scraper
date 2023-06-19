import publicHols from './publicholiday.json'      // gazetted phSplit only
import { getRawData } from './scraper.get.js'
const months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

export default defineEventHandler(async(event) => {
    let clock = {
        "UTC": new Date(),
        "Day": days[new Date().getDay()],
        "calibrated": recalibrateClockForMsiaOfficeHours(),
        "UTC_ms": Date.now(),
        "offset" : new Date().getTimezoneOffset()
    }
    return {clock, publicHols}
}) 

const phSplit = publicHols.map((x)=> {
    return x.date.split("-")
})
// for (const [key, val] of Object.entries(publicHols)) {
//     console.log(key , val);
// }
const cycle = 1000 * 60     // in ms, range: 1000~60000 (1-60 seconds)
const scrapeInHours = '18'    // format as 00-23
const scrapeInMinutes = '30'  // format as MM. multiple of 10 only i.e: 00, 10, 20, 30, 40, 50

setInterval(()=> {
    let timedate = recalibrateClockForMsiaOfficeHours()           
    // let timedate = new Date()    
    // console.log(timedate);       
    let hour = timedate.getUTCHours().toString().padStart(2, 0)
    let minute = timedate.getUTCMinutes().toString().padStart(2, 0)
    let day = days[timedate.getUTCDay()]                // Mon - Sun
    let date = timedate.getUTCDate().toString().padStart(2, 0)
    let month = (timedate.getUTCMonth() + 1).toString().padStart(2, 0)
    let year = timedate.getUTCFullYear().toString().padStart(2, 0)
    // let second = timedate.getUTCSeconds().toString().padStart(2, 0)
    if(isWeekendOrPH(day, date, month, year)) return
    if(checkScrapeSchedule(timedate)) scrapeTheWebOnce()
    if(set2checkScrapeSchedule(hour, minute)) set2scrapeTheWebOnce()
    // console.log(day, ':', date +'-'+ month +'-'+ year, '  > Time :', hour +':'+ minute +':'+ second, '|', timedate );   
}, cycle)

function recalibrateClockForMsiaOfficeHours() {
    let servCl = Date.now()
    // console.log(new Date(servCl));
    let offset = 480 * 60 * 1000            // offset is -480 minutes against UTC
    let newCl = servCl + offset
    // console.log('newCl:', new Date(newCl));
    return new Date(newCl)
}

let shouldScrape = true
function checkScrapeSchedule(cvb) {
    let hr = cvb.getHours().toString().padStart(2, 0)
    let min = cvb.getMinutes().toString().padStart(2, 0)

    if(scrapeInHours==hr && scrapeInMinutes==min) {
        // console.log('time to scrape');
        return true
    }
    else {
        shouldScrape = true
        return false
    }
}
function scrapeTheWebOnce() {
    if(shouldScrape) {
        // console.log('scraping now');
        getRawData()
        shouldScrape = false
    }
}

let shouldScrape2 = true
function set2checkScrapeSchedule(hr, min) {
    // let hr = cvb.getHours().toString().padStart(2, 0)
    // let min = cvb.getMinutes().toString().padStart(2, 0)
    // console.log(hr, min, shouldScrape2);

    if(
        hr=='00' && min=='00' ||
        hr=='01' && min=='00' ||
        hr=='02' && min=='00' ||
        hr=='03' && min=='00' ||
        hr=='04' && min=='00' ||
        hr=='05' && min=='00' ||
        hr=='06' && min=='00' ||
        hr=='07' && min=='00' ||
        hr=='08' && min=='00' ||
        hr=='09' && min=='00' ||
        hr=='10' && min=='00' ||
        hr=='11' && min=='00' ||
        hr=='12' && min=='00' ||
        hr=='13' && min=='00' ||
        hr=='14' && min=='00' ||
        hr=='15' && min=='00' ||
        hr=='16' && min=='00' ||
        hr=='17' && min=='00' ||
        hr=='18' && min=='00' ||
        hr=='19' && min=='00' ||
        hr=='20' && min=='00' ||
        hr=='21' && min=='00' ||
        hr=='22' && min=='00' ||
        hr=='08' && min=='01' ||
        hr=='08' && min=='03' ||
        hr=='08' && min=='05' ||
        hr=='08' && min=='07' ||
        hr=='08' && min=='09' 
    ) {
        // console.log('returning true');
        return true
    }
    else {
        shouldScrape2 = true
        // console.log('returning false');
        return false
    }
}
function set2scrapeTheWebOnce() {
    if(shouldScrape2) {
        console.log('scraping in progress');
        getRawData()
        shouldScrape2 = false
    }
}

function isWeekendOrPH(dayCurr, dateCurr, monthCurr, yearCurr) {
    let isWeekend = dayCurr=='Sat'||dayCurr=='Sun' ? true : false
    let isPH = undefined

    phSplit.forEach((obj, ind)=> {
        let datePH = obj[0].padStart(2,0)
        let mthPH  = obj[1].padStart(2,0)
        let yearPH = obj[2].padStart(2,0)
        if(dateCurr===datePH && monthCurr===mthPH && yearCurr===yearPH) isPH = isPH||true         // here is where the PH dates matched in JSON PH                     
        else isPH = isPH||false        
    })
    if(isPH || isWeekend) console.log('it\'s isWeekendOrPH Day');
    // console.log('isPH:', isPH, '| isWeekend:' ,isWeekend);
    // console.log('isWeekendOrPH:', isPH || isWeekend);
    return isPH || isWeekend
}
