/**
 * 
 * @param {Page} page puppeteer page
 * @param {Integer} step1OptionSelection 
 */
async function step1Handler(page, step1OptionSelection) {
    // handle input parsing
    const input_elements = await page.$$('#step1 input[type="radio"]');
    const input_ids = await page.$$eval('#step1 input[type="radio"]', el => el.map(x => x.getAttribute("value")));

    // handle label parsing
    const label_elements = await page.$$('#step1 label');
    const actual_label_elements = getOnlyInputLabelsElements(label_elements);
    const labels = await getLabelNames(actual_label_elements, page);

    // select input option
    await selectInput(input_elements, page, step1OptionSelection);

    const new_input_elements = await page.$$('#step2 input[type="radio"]');
    console.log(`new input elements length: ${new_input_elements.length}`);
}

function getOnlyInputLabelsElements(label_elements) {
    let actual_label_elements = [];
    for(i=1; i<label_elements.length; i+=2) {
        actual_label_elements.push(label_elements[i]);
    }
    return actual_label_elements;
}

async function getLabelNames(actual_label_elements, page) {
    let labels = [];
    for(i=0; i<actual_label_elements.length; i++) {
        element = actual_label_elements[i];
        const text = await page.evaluate(element => element.textContent, element);
        labels.push(text);
    }
    return labels;
}

async function selectInput(input_elements, page, number) {
    input_element = input_elements[number];
    await input_element.click();    

    console.log('clicked');
    await page.waitFor(2000);
    await page.screenshot({path: 'clicked.png', fullPage: true});
}

module.exports = step1Handler;
