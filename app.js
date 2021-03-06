const fs = require('fs');
const yaml = require('js-yaml');
const puppeteer = require('puppeteer');
const step1Handler = require('./handlers/step1_handler');
const step2Handler = require('./handlers/step2_handler');
const queryCalendarTimes = require('./handlers/query_calendar_times_handler');
const queryCalendarDates = require('./handlers/query_calendar_available_dates_handler');
const generateDateRangeArray = require('./utils/DateHelpers');
const sendEmailNotification = require('./handlers/email_notification_handler');

// parse from config file first
let config = loadConfig();
let step1Option = config.Step1;
let step2Option = config.Step2;
let interval = config.Interval;
let shouldSendEmail = config.ShouldSendEmail == "true" ? true : false;
let startDate = config.StartDate;
let endDate = config.EndDate;

(async() => {
    const browser = await puppeteer.launch({args: [
        "--disable-gpu",
        "--renderer",
        "--no-sandbox",
        "--no-service-autorun",
        "--no-experiments",
        "--no-default-browser-check",
        "--disable-dev-shm-usage",
        "--disable-setuid-sandbox",
        "--no-first-run",
        "--no-zygote",
        "--single-process",
        "--disable-extensions"
        ], defaultViewport: null});

    // set up browser
    console.log(`Using browser: ${await browser.version()}`);
    const page = await browser.newPage();
    await page.goto('https://onlinebusiness.icbc.com/qmaticwebbooking/#/');
    const title = await page.title();
    console.log(`Browsing page: ${title}`);
    
    // waiting for the page to load
    await page.waitFor(1000);

    // take a screenshot to verify :)
    // await page.screenshot({path: './images/initial_screenshot.png', fullPage: true});

    // step1: select a service
    let step1_result = await step1Handler(page, step1Option);

    // open step2 dropdown because selecting a service wont open step2 dropdown :(
    const step2_dropdown_button = await page.$('#step2');
    await step2_dropdown_button.click();    
    await page.waitFor(1000);
    // await page.screenshot({path: './images/step2_dropdown_clicked.png', fullPage: true});

    // step2: select a location
    let step2_result = await step2Handler(page, step2Option);

    // don't need to open step3 dropdown because for some reason, ICBC decided that
    // selecting a location in step2 will automatically bring the user to the date menu
    // but not for step1!!!!!!!!!
    // UI/UX PLZ ICBC or QMatic!

    // step3: We're not gonna use step 3. Just directly call the hidden
    // ICBC API instead.
    // we are going to continuously loop to check whether there are any free slots within
    // date range and time range
    while (true) {
        let availableCalendarDates = await queryCalendarDates(step2_result, step1_result);
        let dateRangeArray = generateDateRangeArray(startDate, endDate);
        let searchDateRangeArray = dateRangeArray.filter(date => availableCalendarDates.includes(date));

        // aggregate the results to make it look nicer
        let availabilityResults = {};
        for(i=0; i<searchDateRangeArray.length; i++) {
            let date = searchDateRangeArray[i];
            let calendarTimes = await queryCalendarTimes(date, step2_result, step1_result);

            availabilityResults[`${date}`] = [];
            calendarTimes.forEach((dateAndTime) => {
                availabilityResults[`${date}`].push(dateAndTime.time);
            });
        }
        console.log(`UTC TIME : ${new Date()}`);
        console.log(availabilityResults);
        console.log(`---------------------------------------------------------------------`);

        if( (!(Object.keys(availabilityResults).length === 0
              && availabilityResults.constructor === Object))
              && shouldSendEmail) {
            sendEmailNotification(availabilityResults);
        }

        await new Promise(r => setTimeout(r, interval));
    }

    await browser.close();
})();

/**
 * @returns {Object} javascript object of config/config.yml file
 */
function loadConfig() {
    try {
        let fileContents = fs.readFileSync('./config/config.yml', 'utf8');
        let data = yaml.safeLoad(fileContents);
        return data;
    } catch (e) {
        console.log(e);
    }
}
