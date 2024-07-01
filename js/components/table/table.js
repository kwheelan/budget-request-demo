import Buttons from './subcomponents/buttons.js'
import Cell from './subcomponents/cells.js'
import Columns from './subcomponents/columns.js'
import Header from './subcomponents/headers.js'
import Rows from './subcomponents/rows.js'

function adjustTableWidth(width_pct){
    const table = document.getElementById('main-table');
    table.style.width = width_pct;
}

function clearTable(){
    const table = document.getElementById('main-table');
    table.querySelector('thead').innerHTML = '';
    table.querySelector('tbody').
    innerHTML = '';
}

function showTable(){
    const table = document.getElementById('main-table');
    table.style.display = 'table';
}

function hideTable(){
    const table = document.getElementById('main-table');
    table.style.display = 'none';
    Buttons.AddRow.hide();
}

const Table = {
    Buttons : Buttons,
    Cell : Cell,
    Columns : Columns,
    Header : Header,
    Rows : Rows,
    // functions
    adjustWidth : function(width_pct){
        adjustTableWidth(width_pct)
    },
    clear : clearTable,
    hide : hideTable,
    show : showTable
}

export default Table;