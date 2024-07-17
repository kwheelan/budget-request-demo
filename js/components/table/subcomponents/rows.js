import Header from "./headers.js";
import { formatCurrency } from "../../../utils/common_utils.js";

async function addNewRow(data_dictionary){
    // Get the table element by its ID
    const table = document.getElementById('main-table');

    // check if header has already been added
    let header_row = table.querySelector('thead tr');
    if (!header_row) {
        Header.add(Object.keys(data_dictionary));
    }

    // add row of data
    const new_row = document.createElement('tr');
    const cell_data_array = Object.values(data_dictionary);

    for (const cell_data of cell_data_array) {
        // Create new cell and add it to the row
        const newCell = document.createElement('td');
        newCell.textContent = cell_data;
        new_row.appendChild(newCell);
    }

    // Append the new row to the table body
    let tbody = table.querySelector('tbody');
    tbody.appendChild(new_row);
}

function saveRowEdits(row){
    var cells = row.querySelectorAll('td')
    cells.forEach( cell => {
        // save dropdown values
        if (cell.querySelector('select')){
            var serviceSelector = cell.querySelector('select');
            cell.textContent = serviceSelector.value;
        } else if (cell.querySelector('input')) {
            // save new entered value in textbox
            var textbox = cell.querySelector('input');
            var enteredValue = textbox.value;
            // update display and format with currency if relevant
            if ( cell.classList.contains('cost') ){
                // if cost, remove commas first
                enteredValue = enteredValue.replaceAll(',', '');
                cell.textContent = formatCurrency(enteredValue);
            } else {
                cell.textContent = enteredValue;
            }
            // set value attribute to the new user input
            cell.setAttribute('value', enteredValue);
        }
    })
}

const Rows = {
    add : function(data_dictionary){
        addNewRow(data_dictionary)
    },
    saveEdits : function(row){
        saveRowEdits(row)
    }
}

export default Rows;