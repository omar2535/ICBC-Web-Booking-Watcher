// File containing all logic about querying the hidden ICBC API for a specific date
// given input_id for location and input_id for service
const request = require('request');

/**
 * 
 * @param {*} location_id input_id for location
 * @param {*} service_id input_id for service
 * Returns an array of date and time available
 */
async function queryCalendarDates(location_id, service_id) {
    let url = `https://onlinebusiness.icbc.com/` +
               `qmaticwebbooking/rest/schedule/` +
               `branches/${location_id}/dates;` +
               `servicePublicId=${service_id};` +
               `customSlotLength=10`.split('\n').join('');
    let data = await requestApi(url);
    let result = convertCaneldarDatesToArray(data);
    return result;
}

function requestApi(url) {
    return new Promise(function (resolve, reject) {
        request(url, { json: true }, function(error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}

// Converts the object from calendar dates API to an array of dates
// available
function convertCaneldarDatesToArray(calendarDates) {
    let calendarDatesArray = [];
    for(i=0; i<calendarDates.length; i++) {
        let currentObject = calendarDates[i];
        calendarDatesArray.push(currentObject.date);
    }
    return calendarDatesArray;
}

module.exports = queryCalendarDates;
