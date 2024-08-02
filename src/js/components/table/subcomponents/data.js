import FundLookupTable from '../../../models/fund_lookup_table.js';
import CurrentFund from '../../../models/current_fund.js'
import CurrentPage from '../../../models/current_page.js'
import Table from '../table.js';

function fillTable(data) {
    try {
        const table = document.getElementById('main-table');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');

        // clear existing data
        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Create table header row
        const headerRow = document.createElement('tr');
        Object.keys(data[0]).forEach(key => {
            const header = document.createElement('th');
            header.textContent = key;
            headerRow.appendChild(header);
        });
        thead.appendChild(headerRow);

        // Create table body rows
        data.forEach(item => {
            const row = document.createElement('tr');
            Object.values(item).forEach(val => {
                const cell = document.createElement('td');
                cell.innerHTML = val;
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });
    } catch(error) {
        console.error('No table saved in localStorage:', error);
    }
}

async function loadFromStorage(){
    // look up table name in storage
    if (CurrentFund.number()){
        var key = `${CurrentPage.load()}_${CurrentFund.number()}`;
    } else {
        var key = CurrentPage.load();
    }
    // load from local storage
    const data = localStorage.getItem(key);
    // if nothing in storage, return a zero
    if ( !data ) {
        return 0;
    } else {
        // otherwise, fill table in HTML and return success (1)
        Table.show();
        fillTable(await JSON.parse(data));
        return 1;
    }
}


function loadFunds(){
    // get list of funds from storage
    const fundDict = FundLookupTable.retrieve();
    // build out data in correct format
    const ret = [];
    Object.keys(fundDict).forEach(key => {
        // determine if the fund has already been edited
        if (fundDict[key]['viewed']){
            // todo: add a checkmark here
            ret.push({'Fund' :  `<span class = 'viewed-fund'> 
                                    <i class="fas fa-check"></i>
                                    ${fundDict[key]['name']}
                                </span>`});
        } else {
            ret.push({'Fund' : `<span class = 'unviewed-fund'> 
                                    ${fundDict[key]['name']}
                                </span>`});   
        }
    });
    fillTable(ret);
}


function getColumnIndexByClass(tbody, className) {
  const firstRow = tbody.rows[0];
  if (!firstRow) return -1; // Return -1 if there's no row to examine
  for (let cellIndex = 0; cellIndex < firstRow.cells.length; cellIndex++) {
      if (firstRow.cells[cellIndex].classList.contains(className)) {
          return cellIndex;
      }
  }
  return -1; // Return -1 if class name not found
}

function sort(primaryClass, secondaryClass) {
  const table = document.getElementById('main-table');
  const tbody = table.tBodies[0];
  const rows = Array.from(tbody.rows);

  // Get the column indices by class name
  const primaryColIndex = getColumnIndexByClass(tbody, primaryClass);
  const secondaryColIndex = getColumnIndexByClass(tbody, secondaryClass);

  // exit if classes don't exist
  if (primaryColIndex === -1 ) {
      console.error(`Column class ${classA} not found in table`);
      return; 
  } else if (secondaryColIndex === -1) {
      console.error(`Column class ${classB} not found in table`);
      return; 
  }

  // Sort the rows based on the text content of the cells
  rows.sort((rowA, rowB) => {
      // Primary column comparison
      const primaryA = unformatCurrency(rowA.cells[primaryColIndex].textContent);
      const primaryB = unformatCurrency(rowB.cells[primaryColIndex].textContent);

      if (primaryA < primaryB) return -1;
      if (primaryA > primaryB) return 1;

      // Secondary column comparison (if primary is equal)
      const secondaryA = unformatCurrency(rowA.cells[secondaryColIndex].textContent);
      const secondaryB = unformatCurrency(rowB.cells[secondaryColIndex].textContent);

      if (secondaryA < secondaryB) return -1;
      if (secondaryA > secondaryB) return 1;

      // If both columns are equal
      return 0;
  });

  // Reattach sorted rows to the table body
  rows.forEach((row) => tbody.appendChild(row));
}


export const Data = {
    load : loadFromStorage,
    loadFunds : loadFunds,
    sort : function(colA, colB) { sort(colA, colB) }
}

export default Data;