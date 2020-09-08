const puppeteer = require('puppeteer');
const step1Handler = require('./handlers/step1_handler');

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
    
    // waiting for 2000
    await page.waitFor(1000);

    // starting
    await page.screenshot({path: './images/initial_screenshot.png', fullPage: true});


    // step1: select a service
    let step1_result = await step1Handler(page, 0);
    console.log(step1_result);

    // open step2 dropdown
    const step2_dropdown_button = await page.$('#step2');
    await step2_dropdown_button.click();    
    await page.waitFor(1000);
    await page.screenshot({path: './images/step2_dropdown_clicked.png', fullPage: true});

    // step2: select a location


    await browser.close();
})().catch((error) => {
    console.log(error);
});
