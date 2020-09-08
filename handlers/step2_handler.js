// File for step 2 of ICBC QMatic web booking form
// some subtle differences from step1 of the form:
// 1. input id's attribute aren't under "value" anymore but instead "aria-labelledby"
// 2. label items aren't counted by every odd element but instead all elements.

/**
 * 
 * @param {Page} page puppeteer page
 * @param {Integer} step1OptionSelection 
 */
async function step2Handler(page, optionSelection) {
    // handle input parsing
    const input_elements = await page.$$('#step2 input[type="radio"]');
    const input_ids = await page.$$eval('#step2 input[type="radio"]', el => el.map(x => x.getAttribute("aria-labelledby")));

    // handle label parsing
    const label_elements = await page.$$('#step2 label');
    const actual_label_elements = getOnlyInputLabelsElements(label_elements);
    const labels = await getLabelNames(actual_label_elements, page);

    // generate the result early
    let result = generateResult(input_ids, labels);

    // select input option
    await selectInput(input_elements, page, optionSelection, result);

    return result[`${optionSelection}`]['input_id'];
}

// generate result object
// has option number as key, value is another object with input_id and label per option
// input_id will be useful later on to query the hidden API
function generateResult(input_ids, labels) {
    let result = {};
    for(i=0; i<input_ids.length; i++) {
        result[`${i}`] = {}
        result[`${i}`]["input_id"] = input_ids[i];
        result[`${i}`]["label"] = labels[i];
    }
    return result;
}

// Different from step 1, this time all the label elements are correct.
// However, we will still keep this function here in case QMatic decides to change this
function getOnlyInputLabelsElements(label_elements) {
    let actual_label_elements = [];
    for(i=0; i<label_elements.length; i++) {
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

async function selectInput(input_elements, page, number, result) {
    input_element = input_elements[number];
    await input_element.click();    

    console.log(`Clicked input option: ${result[`${number}`]["label"]}`);
    await page.waitFor(1000);
    // await page.screenshot({path: './images/step2_option_selected.png', fullPage: true});
}

module.exports = step2Handler;
