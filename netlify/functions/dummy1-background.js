// import { schedule } from "@netlify/functions"

exports.handler = function(event, context) {
    console.log('dummy1 called');
    return { statusCode: 200, body:'API call successful' };
};
// exports.handler = schedule("1/5 * * * *", handler);   

