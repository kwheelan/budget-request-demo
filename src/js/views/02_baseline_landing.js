import NavButtons from "../components/nav_buttons/nav_buttons.js";
import Table from "../components/table/table.js";
import { View, ViewTable } from './view_class.js'
import CurrentFund from "../models/current_fund.js";

export class FundView extends View {

    constructor() {
        super();
        this.page_state = 'baseline-landing';
        this.prompt = `We will now ask you a series of questions about your BASELINE budget request.
            At the end, we will ask you about any new initiatives (ie. supplemental requests).
            Select one of your funds then click continue.`;
        this.subtitle = 'Baseline Budget Request';
        this.table = new FundTable();
        this.sidebar = false;
        this.dataTable = false;
    }

    visit() {
        // remove fund selection
        localStorage.setItem("fund", '');
        super.visit();
    }
}

class FundTable extends ViewTable {

    constructor() {
        super();

        // add additional revenue columns to the table
        this.columns = [
            { title: 'Fund', className: 'fund-name' }
        ];

        this.noDataMessage = 'No funds found.'
        this.addEdit = false;
    }

    build(){
        // load in fund data
        Table.show();
        Table.Data.loadFunds();
        Table.Columns.assignClasses(this.columns);
        Table.adjustWidth('30%');

        // disable next button until a fund is selected
        NavButtons.Next.disable();
        allowRowSelection();
    }
}


function allowRowSelection(){
    
    var tableRows = document.querySelectorAll("tbody tr");
    
    // enable highlight on hover and on select
    tableRows.forEach(function(row) {
        row.addEventListener('mouseover', function() {
            this.classList.add('hover-effect');
        });
        row.addEventListener('mouseout', function() {
            this.classList.remove('hover-effect');
        });
        row.addEventListener('click', function() {
            selectFund(tableRows, this);
        });
    });
}

function selectFund(tableRows, selected_row){

    // remove selected class from any other rows
    tableRows.forEach(function(tableRow) {
        tableRow.classList = '';
    });

    // add selected class to clicked row
    selected_row.classList.add('selected');

    // get fund and save selected fund
    var fund = selected_row.querySelector('.fund-name').textContent;
    var fundNumber = parseInt(fund);
    CurrentFund.update(fundNumber);

    // enable next step
    NavButtons.Next.enable();
}

export default FundView;