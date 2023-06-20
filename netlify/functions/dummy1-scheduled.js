import { schedule } from "@netlify/functions"

let counter = 0
const handler = async function(event, context) {
    console.log(counter, "dummy1 scheduled function");
    counter++

    return { statusCode: 200 };
};
exports.handler = schedule("1/5 * * * *", handler);   

