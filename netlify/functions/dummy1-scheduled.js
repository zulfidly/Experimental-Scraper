import { schedule } from "@netlify/functions"


const handler = async function(event, context) {
    console.log("Netlify scheduled function running");

    return { statusCode: 200 };
};
exports.handler = schedule("1/5 * * * *", handler);   

