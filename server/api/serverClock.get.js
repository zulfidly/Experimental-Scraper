import publicHols from '../../public/publicholiday.json'      // gazetted phSplit only
const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

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

function recalibrateClockForMsiaOfficeHours() {
    let servCl = Date.now()
    // console.log(new Date(servCl));
    let offset = 480 * 60 * 1000            // offset is -480 minutes against UTC
    let newCl = servCl + offset
    // console.log('newCl:', new Date(newCl));
    return new Date(newCl)
}