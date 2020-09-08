// File for step 1 of ICBC QMatic web booking form

/**
 * 
 * @param {Page} page puppeteer page
 * @param {Integer} optionSelection 
 * return input_id for option selected 
 */
async function step1Handler(page, optionSelection) {
    // handle input parsing
    const input_elements = await page.$$('#step1 input[type="radio"]');
    const input_ids = await page.$$eval('#step1 input[type="radio"]', el => el.map(x => x.getAttribute("value")));

    // handle label parsing
    const label_elements = await page.$$('#step1 label');
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

// since there are 2x the number of label elements,
// we only need every odd indexed label elements in the array
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

async function selectInput(input_elements, page, number, result) {
    input_element = input_elements[number];
    await input_element.click();

    console.log(`Clicked input option: ${result[`${number}`]["label"]}`);
    await page.waitFor(1000);
    await page.screenshot({path: './images/step1_option_selected.png', fullPage: true});
}

module.exports = step1Handler;
