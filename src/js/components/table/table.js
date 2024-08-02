import './table.css';

import Buttons from './subcomponents/buttons.js'
import Cell from './subcomponents/cells.js'
import Columns from './subcomponents/columns.js'
import Header from './subcomponents/headers.js'
import Rows from './subcomponents/rows.js'
import Data from './subcomponents/data.js'
import Tooltip from '../tooltip/tooltip.js';
import { convertToJSON } from "../../utils/JSON_data_handlers.js";
import Sidebar from '../sidebar/sidebar.js';
import CurrentFund from '../../models/current_fund.js';
import CurrentPage from '../../models/current_page.js';

function adjustTableWidth(width_pct){
    const table = document.getElementById('main-table');
    table.style.width = width_pct;
}

function showTable(){
    const tableContainer = document.querySelector('.table-container');
    tableContainer.innerHTML = Table.html;
    const table = document.getElementById('main-table');
    table.style.display = 'table';
}

function hideTable(){

    // delete table object from table container
    const tableContainer = document.querySelector('.table-container');
    tableContainer.innerHTML = '';
    Buttons.AddRow.hide();
    // delete search bar
    document.querySelector('#search-bar-container').innerHTML = '';
}

function saveTableData() {
    // remove the detail text
    Tooltip.unlink();
    // get table
    var table = document.getElementById('main-table');
    // determine save_as name
    if (CurrentFund.number()) {
        var save_as = `${CurrentPage.load()}_${CurrentFund.number()}`;
    } else {
        var save_as = CurrentPage.load();
    }
    localStorage.setItem(save_as, convertToJSON(table, ['Edit']));
    // update sidebar with new data
    Sidebar.updateTotals();
    // relink, depending on page
    Tooltip.linkAll();
}

const Table = {
    html : `
        <table class="table table-bordered mt-3 display" id="main-table">
            <thead class="thead-dark"></thead>
            <tbody></tbody>
        </table>`,
    Buttons : Buttons,
    Cell : Cell,
    Columns : Columns,
    Header : Header,
    Rows : Rows,
    Data : Data,
    // functions
    adjustWidth : function(width_pct){
        adjustTableWidth(width_pct)
    },
    // TODO: delete
    clear : hideTable,
    hide : hideTable,
    show : showTable,
    save : saveTableData
}

export default Table;