import Airtable from 'airtable'
var base = new Airtable({apiKey: process.env.AT_TOKEN}).base(process.env.AT_BASE_ID);

const URL = "https://www.bursamalaysia.com/bm/trade/trading_resources/listing_directory/company-profile?stock_code=1155";
// console.log('getRawData', getRawData(URL))




async function getRawData(URL) {
    return await fetch(URL)
       .then((response) => response.text())
       .then((data) => {
            let entry = {
                "fields": {
                  "Date": getDate(),
                  "Time": getServerClock(),
                  "PreviousClose": previousClose(data),
                  "LastDone": lastDone(data),
                  "Open": getOpen(data),
                  "High": getHigh(data),
                  "Low": getLow(data),
                  "JSON": undefined,
                }
            } 
            console.log('entrY :', entry);
            validateEntryBeforeAddToTable(entry)
            // setInterval(()=> addEntryToTable(entry), 60000)
            // addEntryToTable(entry) 
        })
       .catch((err)=> console.log(err))
};
function validateEntryBeforeAddToTable(q) {
    if(
        Number(q.fields.PreviousClose) &&
        Number(q.fields.LastDone) &&
        Number(q.fields.Open) &&
        Number(q.fields.High) &&
        Number(q.fields.Low)
    ) {
        // console.log('entry okayed for upload');
        q.fields.JSON = JSON.stringify(q)
        // console.log(q.fields.JSON);
        if(isWeekend()) return
        else  addEntryToTable(q)
        console.log(q);
    } else {
        // console.log('bad entry data');
        // setinterval until data is perfectly formed
        let dummy = {
            "fields": {
                "Date": getDate(),
                "Time": getServerClock(),
                "PreviousClose": previousClose(q),
                "LastDone": lastDone(q),
                "Open": getOpen(q),
                "High": getHigh(q),
                "Low": getLow(q),
                "JSON": JSON.stringify(q),
            }
        }
        addEntryToTable(dummy)
    }
}

function isWeekend() {
    let d = new Date(Date.now())
    let x = d.getDay()
    if(x == 0 || x == 6) return true        // 0=sunday, 6=saturday
    else return false
}

function getOpen(x) {
    let str = '<th scope="row">Open</th>'
    let strLength = str.length
    let start = x.indexOf(str) + strLength + 1
    let end = start + 17
    let open = x.slice(start, end).trim()
    let openClean = open.replace(/[A-Z<>"='/]/ig,'').trim()
    if(Number(openClean)) return openClean
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
    if(Number(lastDoneClean)) return lastDoneClean
    else {
        let str = '<span class="up"></span>'    // or use <span class="down"></span>
        let strLength = str.length
        let start = x.indexOf(str) + strLength - 0
        let end = start + 10
        let lastDone = x.slice(start, end).trim()
        let lastDoneClean = lastDone.replace(/[A-Z<>"='/]/ig,'').trim()
        return Number(lastDoneClean)||'invalid'
    }
}

function previousClose(x) {
    let str = '<th class="w-50" scope="row">LACP</th>'
    let strLength = str.length
    let start = x.indexOf(str) + strLength + 16
    let end = start + 11
    let prevClose = x.slice(start, end).trim()
    let prevCloseClean = prevClose.replace(/[A-Z<>"=/']/ig,'').trim()
    if(Number(prevCloseClean)) return prevCloseClean
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
    if(Number(highClean)) return highClean
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
    if(Number(lowClean)) return lowClean
    else return 'invalid'
    // console.log('low is :', low, low.length)
    // console.log('lowClean is :', lowClean, lowClean.length);
}

function addEntryToTable(entry) {
    base(process.env.AT_TABLE1_ID)
    .create([entry],
        function(err, records) {
            if (err) {
            console.error('ADD ENTRY ERROR', err);
            return;
            }
            records.forEach(function (record) {
            console.log(record.getId());
            });
        }
    );
}

// getDate()
// getServerClock()
function getDate() {    // formatted as YYYY-MM-DD
    let d = new Date(Date.now())
    let ts = d.getFullYear().toString() + '-' + (d.getMonth()+1).toString().padStart(2,0) + '-' + d.getDate().toString().padStart(2,0)
    console.log('timestamp :', ts);
    return ts 
}
function getServerClock() {
    let d = new Date(Date.now())
    let sc = d.getHours().toString().padStart(2,0) + ':' + d.getMinutes().toString().padStart(2,0) 
    console.log('server Clock =', sc);       // getHours() returns (0-23)
    return sc
}

