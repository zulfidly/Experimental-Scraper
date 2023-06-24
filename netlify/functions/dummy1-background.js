// import { schedule } from "@netlify/functions"

exports.handler = function(event, context) {
    return { statusCode: 200, body:'API call successful' };
};
// exports.handler = schedule("1/5 * * * *", handler);   

