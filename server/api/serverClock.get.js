export default defineEventHandler(async(event) => {
    let serverUTC_full = new Date()
    let serverDateNow = Date.now()
    let serverLocalMS = serverDateNow + serverUTC_full.getTimezoneOffset()
    let offsetmin = serverUTC_full.getTimezoneOffset()
    let offsetms = offsetmin * 60 * 1000 * (1)

    let serverLocal = new Intl.DateTimeFormat(
        'en-GB',
        { dateStyle: 'full', hour12:true, timeStyle: 'long' }
    ).format(new Date(serverDateNow + offsetms))

    // let ts = serverUTC_full.getFullYear().toString() + '-' + (serverUTC_full.getMonth()+1).toString().padStart(2,0) + '-' + serverUTC_full.getDate().toString().padStart(2,0)
    // let c = serverUTC_full.getHours().toString().padStart(2,0) + ':' + serverUTC_full.getMinutes().toString().padStart(2,0) 
    // console.log('timestamp :', ts);
    // console.log('server Clock =', c);       // getHours() returns (0-23)
    let obj = {
        "serverUTC": serverUTC_full,
        "serverLocal": serverLocal,
    }
    return {obj}
}) 