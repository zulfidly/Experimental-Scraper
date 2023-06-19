// YOUR_BASE_DIRECTORY/netlify/functions/test-scheduled-function.js
import { getRawData } from "../../server/api/scraper.get.js";
const { schedule } = require("@netlify/functions");

const handler = async function(event, context) {
    console.log("Received event:", event, 'Context:', context);
    getRawData()
    return {
        statusCode: 200,
    };
};

// exports.handler = schedule("@hourly", handler);
exports.handler = schedule("1/10 * * * *", handler);        //“At every 10th minute from 1 through 59.”
