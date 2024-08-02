
import { View, ViewTable } from './view_class.js'
import Table from "../components/table/table.js";
import Form from "../components/form/form.js";
import FundLookupTable from '../models/fund_lookup_table.js';
import { FISCAL_YEAR } from '../constants/';


const dropdownOptions = ['N/A', 'One-Time', 'Recurring']

// set up page and initialize all buttons
export class InitiativesView extends View {

    constructor() {
        super();
        this.page_state = 'new-inits';
        this.prompt = `
            This is the place to propose new initiatives for FY${FISCAL_YEAR}.
            New initiative submissions will count as supplemental line items and will be the starting 
            point for a conversation with both OB and ODFS, who will help with the details.`;
        this.subtitle = 'New Initiatives';
        this.table = new InitiativesTable();
    }

    visit() {
        // remove fund selection
        localStorage.setItem("fund", '');
        super.visit();
    }

}

class InitiativesTable extends ViewTable {

    constructor() {
        super();

        // add additional columns to the table
        this.columns = this.columns.concat([
            { title: 'Initiative Name', className: 'init-name' },
            { title: 'Ballpark Total Expenses', className: 'total', isCost: true },
            { title: 'Personnel Cost', className: 'personnel', isCost: true },
            { title: 'Non-personnel Cost', className: 'nonpersonnel', isCost: true },
            { title: 'Revenue', className: 'revenue', isCost: true },
            { title: 'Revenue Type', className: 'rev-type' },

            // hide the explanation columns
            { title: 'Q1', className: 'q1', hide: true },
            { title: 'Q2', className: 'q2', hide: true },
            { title: 'Q3', className: 'q3', hide: true }
        ]);

        this.addButtonText = 'Add new initiative' ;
    }

    addCustomQuestions(){

        // general questions
        Form.NewField.shortText('Initiative Name:', 'init-name', true); 
        Form.NewField.longText('What is the business case for the Initiative?', 'q1', true);
        Form.NewField.longText(`Why is the initiative needed? What is the value-add to residents? 
            What is the Department’s plan for implementing the Initiative?`, 'q2', true);
        Form.NewField.longText(`Why can’t the Initiative be funded with the Department’s baseline budget?`, 'q3', true);

        // TODO: Edit to drop down
        Form.NewField.dropdown('Fund:', 'fund-name', FundLookupTable.listFundNames(), true);
        Form.NewField.dropdown('Appropriation (if known):', 'approp-name', FundLookupTable.getApprops(), true);
        Form.NewField.dropdown('Cost Center (if known):', 'cc-name', FundLookupTable.getCostCenters(), true);

        // Numbers
        Form.NewField.numericInput('What is your ballpark estimate of TOTAL ADDITONAL expenses associated with this initiative?', 
            'total', false);
        Form.NewField.numericInput('Estimate of ADDITONAL personnel cost?', 'personnel', false);
        Form.NewField.numericInput('Estimate of ADDITONAL nonpersonnel cost?', 'nonpersonnel', false);
        Form.NewField.numericInput('Estimate of ADDITONAL revenue (if applicable)?', 'revenue', false);
        Form.NewField.dropdown(`If there will be revenue, is it one-time or recurring?`, 
            'rev-type', dropdownOptions);
    }

    // action on row edit click: make cells editable
    actionOnEdit() { 
        Table.Cell.createTextbox('total', true);
        Table.Cell.createTextbox('revenue', true);
        Table.Cell.createTextbox('personnel', true);
        Table.Cell.createTextbox('nonpersonnel', true);
        Table.Cell.createTextbox('init-name');
        Table.Cell.createDropdown('rev-type', dropdownOptions);
    }

}

export default InitiativesView;