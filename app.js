const puppeteer = require('puppeteer');
const step1Handler = require('./handlers/step1_handler');
const step2Handler = require('./handlers/step2_handler');
const queryCalendarTimes = require('./handlers/query_calendar_times_handler');
const queryCalendarDates = require('./handlers/query_calendar_available_dates_handler');

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
    await page.screenshot({path: './images/initial_screenshot.png', fullPage: true});

    // step1: select a service
    let step1_result = await step1Handler(page, 0);

    // open step2 dropdown because selecting a service wont open step2 dropdown :(
    const step2_dropdown_button = await page.$('#step2');
    await step2_dropdown_button.click();    
    await page.waitFor(1000);
    await page.screenshot({path: './images/step2_dropdown_clicked.png', fullPage: true});

    // step2: select a location
    let step2_result = await step2Handler(page, 0);

    // don't need to open step3 dropdown because for some reason, ICBC decided that
    // selecting a location in step2 will automatically bring the user to the date menu
    // but not for step1!!!!!!!!!
    // UI/UX PLZ ICBC or QMatic!

    // step3: We're not gonna use step 3. Just directly call the hidden
    // ICBC API instead. Muahahahaha. I'm so evil. Plz don't hurt me.
    let calendarDates = await queryCalendarDates(step2_result, step1_result);
    console.log(calendarDates);

    let calendarTimes = await queryCalendarTimes('2020-09-10', step2_result, step1_result);
    console.log(calendarTimes);

    // final step
    // we are going to continuously loop to check whether there are any free slots within that day
    // if there is, notify
    // default delay of 

    await browser.close();
})().catch((error) => {
    console.log(error);
});
