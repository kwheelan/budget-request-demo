import Prompt from "../../components/prompt/prompt.js";
import Table from '../../components/table/table.js'
import Sidebar from "../../components/sidebar/sidebar.js";
import { DATA_ROOT, fringe, cola, merit } from "../../init.js"
import Body from "../../components/body/body.js";
import NavButtons from "../../components/nav_buttons/nav_buttons.js";
import Subtitle from "../../components/header/header.js";
import Form from "../../components/form/form.js";
import Modal from "../../components/modal/modal.js";

const personnelColumns = [
    { title: 'Job Name', className: 'job-name' },
    { title: 'Baseline FTEs', className: 'baseline-ftes' },
    { title: 'Supplemental FTEs', className: 'supp-ftes' },
    { title: 'Service', className: 'service' },
    { title: 'Total Cost (Baseline)', className: 'total-baseline', isCost: true },
    { title: 'Total Cost (Supplementary)', className: 'total-supp', isCost: true },
    { title: 'Current Average Salary', className: 'avg-salary', isCost: true }
];

export function preparePageView(){
    // prepare page view
    Body.reset();
    NavButtons.show();
    Sidebar.show();
    Table.adjustWidth('90%');
    // just enable next for now
    // TODO only enable when all info is entered
    NavButtons.Next.enable();

    // update page text
    Subtitle.update('Personnel');
    Prompt.Text.update('For each job in your department, select the service and request the number of baseline and supplemental FTEs.');
}

function personnelRowOnEdit(){
    Table.Cell.createTextbox('baseline-ftes');
    Table.Cell.createTextbox('supp-ftes');
    Table.Cell.createDropdown('service', DATA_ROOT + 'services.json');
}

export async function initializePersonnelTable(){
    // load table data from json
    await Table.Data.loadFromJSON(DATA_ROOT + 'personnel_data.json');
    //after table is loaded, fill it
    Table.show();
    Table.Columns.add(3, '', 'Service');
    Table.Columns.addAtEnd('0', 'Total Cost (Baseline)');
    Table.Columns.addAtEnd( '0', 'Total Cost (Supplementary)');
    Table.Columns.addAtEnd(Table.Buttons.edit_confirm_btns, ' ');
    // assign cost classes
    Table.Columns.assignClasses(personnelColumns);
    // activate edit buttons
    Table.Buttons.Edit.init(personnelRowOnEdit, updateDisplayandTotals);
    initializeRowAddition();
}

function initializeRowAddition(){
    Table.Buttons.AddRow.updateText("Add new job name");
    Table.Buttons.AddRow.show();
}

function calculateTotalCost(ftes, avg_salary, fringe, cola, merit){
    return ftes * avg_salary * (1 + fringe) * (1 + cola) * (1 + merit);
}

// update sidebar and also cost totals when the FTEs are edited
function updateDisplayandTotals(){
    // initialize
    Sidebar.updateStat('baseline-personnel', 0);
    Sidebar.updateStat('supp-personnel', 0);
    // calculate for each row
    let rows = document.getElementsByTagName('tr');
    for (let i = 1; i < rows.length; i++){
        // fetch values for calculations
        let avg_salary = Table.Cell.getValue(rows[i], 'avg-salary');
        let baseline_ftes = Table.Cell.getValue(rows[i], 'baseline-ftes');
        let supp_ftes = Table.Cell.getValue(rows[i], 'supp-ftes');

        // calcuate #FTEs x average salary + COLA adjustments + merit adjustments + fringe
        let total_baseline_cost = calculateTotalCost(baseline_ftes, avg_salary, fringe, cola, merit);
        let total_supp_cost = calculateTotalCost(supp_ftes, avg_salary, fringe, cola, merit);

        // update counters
        Sidebar.incrementStat('baseline-personnel', total_baseline_cost);
        Sidebar.incrementStat('supp-personnel', total_supp_cost);

        // update totals in table
        Table.Cell.updateValue(rows[i], 'total-baseline', total_baseline_cost);
        Table.Cell.updateValue(rows[i], 'total-supp', total_supp_cost);
    }
}


export function setUpModal() {
    // Initialize modal
    Modal.clear();
    Modal.Link.add('add-btn');
    Modal.Title.update('New job');
}

export function setUpForm() {
    // Set up form
    Form.new('modal-body');
    Form.NewField.shortText('Job Name:', 'job-name', true); 
    Form.NewField.shortText('Account String:', 'account-string', true); 
    // Form.NewField.longText('Explain why this initiative is necessary and describe its potential impact.', 'Explanation', true);
    // Form.NewField.numericInput('Estimate of ADDITONAL personnel cost?', 'Personnel Cost', true);
    // Form.NewField.numericInput('Estimate of ADDITONAL nonpersonnel cost?', 'Non-personnel Cost', true);
    // Form.NewField.numericInput('Estimate of TOTAL ADDITIONAL cost?', 'Total Cost', true);
    Form.SubmitButton.add();
    // Initialize form submission to table data
    handleFormSubmissions();
}

function handleFormSubmissions(event){
        // initialize form submission
        
        const modal = document.getElementById('main-modal');
        modal.addEventListener('submit', function(event) {
            event.preventDefault();
            // get answers from form, hide form, show answers in table
            const responses = Form.fetchAllResponses(event);
            // make sure it's not an empty response
            if (Object.values(responses)[0] != ''){
                // change page view
                Modal.hide();
        
                // add data to table
                Table.Rows.add(responses);
                Table.show();
                Table.Buttons.AddRow.show();
                // TODO: save table data
                // TODO: edit cost to show currency correctly
                }

        })
}