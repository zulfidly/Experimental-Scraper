import publicHols from '../../public/publicholiday.json'      // gazetted phSplit only
const days = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

export default defineEventHandler(async(event) => {
    let clock = {
        "UTC": new Date(),
        "Day": days[new Date().getDay()],
        "calibrated": recalibrateClockForMsiaOfficeHours(),
        "UTC_ms": Date.now(),
        "offset" : new Date().getTimezoneOffset()
    }
    return {clock, publicHols}
}) 

