import { schedule } from "@netlify/functions"

let counter2 = 0
const handler = async function(event, context) {
    console.log(counter2, "counter2 scheduled function");
    counter2++    
    return await fetch("https://www.malaysiastock.biz/Corporate-Infomation.aspx?securityCode=0166")
    .then((response) => {
        console.log('counter :', counter2);
    })
    .catch((err)=> console.log('fetchERROR:', err))
};
exports.handler = schedule("1/30 * * * *", handler);   

