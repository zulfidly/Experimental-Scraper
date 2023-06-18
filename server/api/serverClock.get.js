export default defineEventHandler(async(event) => {
    let serverUTC_full = new Date()
    let serverDateNow = Date.now()
    let offsetTimeinMins = serverUTC_full.getTimezoneOffset()

    let obj = {
        "serverUTC": serverUTC_full,
        "serverUTC_ms": serverDateNow,
        "offsetTime_mins" : offsetTimeinMins
    }
    return obj
}) 