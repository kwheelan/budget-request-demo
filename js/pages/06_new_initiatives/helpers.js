
import { updateSubtitle } from '../../components/header/header.js'
import Prompt from '../../components/prompt/prompt.js'
import { addModalLink, updateModalTitle, clearModal, hideModal } from '../../components/modal/modal.js'
import { fetchAllResponses, addTextarea, addTextInput, addNumericInput, addSubmitButtonToForm, addForm } from '../../components/form/form.js'
import Table from '../../components/table/table.js'
import Body from '../../components/body/body.js'
import NavButtons from '../../components/nav_buttons/nav_buttons.js'
import { nextPage } from '../../utils/navigation-logic.js'

export function initializePageView() {
    // Prepare page view
    Body.clearAll();
    NavButtons.show();
    Prompt.Buttons.Right.addAction(nextPage);

    // Load text
    updateSubtitle('New Initiatives');
    Prompt.Text.update('Do you have any new initiatives for FY26?');
    Prompt.Buttons.Left.updateText('Yes');
    Prompt.Buttons.Right.updateText('No');
}

export function setUpModal() {
    // Initialize modal
    clearModal();
    addModalLink('option1', 'main-modal');
    updateModalTitle('New initiative');
    addModalLink('add-btn', 'main-modal');
}

export function setUpForm() {
    // Set up form
    addForm();
    addTextInput('Initiative Name:', 'Initiative Name', true); // Add required field
    addTextarea('Explain why this initiative is necessary and describe its potential impact.', 'Explanation', true);
    addNumericInput('Estimate of ADDITONAL personnel cost?', 'Personnel Cost', true);
    addNumericInput('Estimate of ADDITONAL nonpersonnel cost?', 'Non-personnel Cost', true);
    addNumericInput('Estimate of TOTAL ADDITIONAL cost?', 'Total Cost', true);
    addSubmitButtonToForm();
    // Initialize form submission to table data
    handleFormSubmissions();
}

export function setUpTable() {
    // Set up table
    Table.clear();
    Table.adjustWidth('70%');
    Table.Buttons.AddRow.updateText('Add another new initiative');
}

export function handleFormSubmissions(event){
        // initialize form submission
        const modal = document.getElementById('main-modal');
        modal.addEventListener('submit', function(event) {
            // get answers from form, hide form, show answers in table
            const responses = fetchAllResponses(event);
            // make sure it's not an empty response
            if (Object.values(responses)[0] != ''){
                // change page view
                hideModal('main-modal');
                hidePrompt();
        
                // add data to table
                Table.Rows.add(responses);
                Table.show();
                Table.Buttons.AddRow.show();
                // TODO: save table data
                // TODO: edit cost to show currency correctly
                }

        })
}
