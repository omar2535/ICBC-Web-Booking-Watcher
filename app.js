const puppeteer = require('puppeteer');
const step1Parser = require('./handlers/step1_handler');

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
    await page.screenshot({path: 'screenshot.png', fullPage: true});


    await step1Parser(page);

    await browser.close();
})().catch((error) => {
    console.log(error);
});
