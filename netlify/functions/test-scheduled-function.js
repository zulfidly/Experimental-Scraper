// YOUR_BASE_DIRECTORY/netlify/functions/test-scheduled-function.js
// import { getRawData } from "../../server/api/scraper.get.js";
import Airtable from 'airtable'

import { schedule } from "@netlify/functions"
// const { schedule } = require("@netlify/functions");
var base = new Airtable({apiKey: process.env.AT_TOKEN}).base(process.env.AT_BASE_ID);
const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

const handler = async function(event, context) {
    // console.log("Received event:", event, 'Context:', context);
    console.log("Netlify scheduled function running");
    getRawData()
    return {
        statusCode: 200,
    };
};
// exports.handler = schedule("@hourly", handler);          // “At minute 0 every hour” https://crontab.guru/
exports.handler = schedule("1/10 * * * *", handler);        //“At every 10th minute from 1 through 59.”

async function getRawData() {
    return await fetch("https://www.bursamalaysia.com/bm/trade/trading_resources/listing_directory/company-profile?stock_code=1155")
       .then((response) => response.text())
       .then((data) => {
            let entry = {
                "fields": {
                  "Date": getLocalDate(),
                  "Day": days[new Date().getDay()],
                  "Time(24hr)": getLocalTime(),
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
            // console.log('entrY :', entry);
            addEntryToTable(entry) 
        })
       .catch((err)=> console.log(err))
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

function getLocalDate() {    // formatted as YYYY-MM-DD
    let d = new Date(Date.now())
    let ts = d.getFullYear().toString() + '-' + (d.getMonth()+1).toString().padStart(2,0) + '-' + d.getDate().toString().padStart(2,0)
    console.log('timestamp :', ts);
    return ts 
}
function getLocalTime() {            // HH:MM in 24hours format
    let d = new Date(Date.now())
    let hr = d.getHours().toString().padStart(2, 0)
    let min = d.getMinutes().toString().padStart(2, 0)
    return hr + ':' + min
}

    



