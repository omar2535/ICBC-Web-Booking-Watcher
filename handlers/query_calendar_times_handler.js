// File containing all logic about querying the hidden ICBC API for a specific date
// given input_id for location and input_id for service
const request = require('request');

/**
 * 
 * @param {Date} date Format: YYYY-MM-DD
 * @param {*} location_id input_id for location
 * @param {*} service_id input_id for service
 * Returns an array of date and time available
 */
async function queryCalendarTimes(date, location_id, service_id) {
    let url = `https://onlinebusiness.icbc.com/` +
               `qmaticwebbooking/rest/schedule/` +
               `branches/${location_id}/dates/` +
               `${date}/times;servicePublicId=${service_id};` +
               `customSlotLength=10`.split('\n').join('');
    let data = await requestApi(url);
    return data;
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

module.exports = queryCalendarTimes;
