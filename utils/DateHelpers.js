/**
 * 
 * @param {String} startDate YYYY-MM-DD
 * @param {String} endDate YYYY-MM-DD
 * @returns {Array} returns an array of dates from the start date to the end date
 */
function generateDateRangeArray(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let currentDate = new Date(start);
    let result = [];
    while(currentDate <= end) {
        result.push(currentDate.toISOString().split('T')[0]);
        var newDate = currentDate.setDate(currentDate.getDate() + 1);
        currentDate = new Date(newDate);
    }
    return result;
}

module.exports = generateDateRangeArray;