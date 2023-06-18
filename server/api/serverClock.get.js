export default defineEventHandler(async(event) => {
    let d = new Date(Date.now())
    let ts = d.getFullYear().toString() + '-' + (d.getMonth()+1).toString().padStart(2,0) + '-' + d.getDate().toString().padStart(2,0)
    let c = d.getHours().toString().padStart(2,0) + ':' + d.getMinutes().toString().padStart(2,0) 
    // console.log('timestamp :', ts);
    // console.log('server Clock =', sc);       // getHours() returns (0-23)
    let obj = {
        "time": ts,
        "clock": c,
    }
    return obj
}) 