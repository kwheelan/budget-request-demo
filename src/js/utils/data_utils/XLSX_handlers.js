

import { SHEETS } from '../../init.js';
import { FundLookupTable, Services } from './budget_data_handlers.js';
import { removeNewLines } from '../common_utils.js';
import { Baseline } from './local_storage_handlers.js';

function deleteTopRowsUntilFullData(data) {
    // function to try to find the top of the usable data
    let fullDataRowFound = false;

    while (!fullDataRowFound && data.length > 0) {
        const row = data[0]; // Get the top row
        let hasAllData = true;

        for (const cell of row) {
            if (cell == null || cell === '') {
                hasAllData = false;
                break;
            }
        }

        if (hasAllData && row.length > 1) {
            fullDataRowFound = true;
        } else {
            // delete the top row if it's not the header row
            data.shift();
        }
    }

    return data;
}

export function processWorkbook(arrayBuffer) {
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    workbook.SheetNames.forEach(sheetName => {
        // only convert sheets we need
        if (Object.keys(SHEETS).includes(sheetName)) {
             // read in sheets
            const sheet = workbook.Sheets[sheetName];
            const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

            // Clean the data by removing top rows with incomplete data
            const dataRows = deleteTopRowsUntilFullData(rawData);

            // get new headers
            const headers = dataRows[0];

            // isolate Fund column to split data
            const fundIndex = headers.indexOf('Fund');
            if (fundIndex === -1) {
                console.error(`No 'Fund' column found in sheet ${sheetName}`);
                return;
            }

            // Save a dictionary of data for each fund for each sheet
            const fundData = {};

            dataRows.forEach(row => {
                const fund = row[fundIndex];
                if(fund && fund != "Fund"){
                    if (!fundData[fund]) {
                        fundData[fund] = [];
                    }
                    const rowData = {};
                    headers.forEach((header, index) => {
                        rowData[removeNewLines(header)] = row[index];
                    });
                    fundData[fund].push(rowData);
                }
            });

            // save fund number and name as we go along
            FundLookupTable.update(fundData);            

            Object.keys(fundData).forEach(fund => {
                const key = `${SHEETS[sheetName]}_${fund}`;
                localStorage.setItem(key, JSON.stringify(fundData[fund]));
            });
        }

        // But also save the possible services
        else if (sheetName == 'Drop-Downs'){
            const sheet = workbook.Sheets[sheetName];
            // Convert the sheet to JSON to easily manipulate data
            const sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Locate the "services" column header in row 0
            const headerRow = sheetData[0];
            const servicesIndex = headerRow.indexOf('Services');

            if (servicesIndex === -1) {
                console.error('Header "Services" not found');
            } else {
                // Extract data from the "services" column (excluding the header row)
                const servicesColumn = sheetData.slice(1).map(row => row[servicesIndex]);
                const cleanedServicesColumn = servicesColumn.filter(value => value != null);
                // save the data
                Services.save(cleanedServicesColumn);
            }
        }
    });

    console.log('all excel data saved');
}

// Utility function to append a sheet to the workbook if data is present
function appendSheetToWorkbook(workbook, data, sheetName) {
    if (data.length > 0) {
        const sheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, sheet, sheetName);
    }
}

export function downloadXLSX() {
    const baseline = new Baseline();
    const workbook = XLSX.utils.book_new(); // Create a new workbook

    const dataMap = {
        Personnel: 'personnel',
        Overtime: 'overtime',
        NonPersonnel: 'nonpersonnel',
        Revenue: 'revenue'
    };

    const sheetData = {
        Personnel: [],
        Overtime: [],
        NonPersonnel: [],
        Revenue: []
    };

    baseline.funds.forEach(fund => {
        Object.keys(dataMap).forEach(sheetName => {
            if (fund[dataMap[sheetName]] && fund[dataMap[sheetName]].table) {
                sheetData[sheetName].push(...fund[dataMap[sheetName]].table);
            }
        });
    });

    Object.keys(sheetData).forEach(sheetName => {
        appendSheetToWorkbook(workbook, sheetData[sheetName], sheetName);
    });

    // Generate a downloadable file
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });

    // Create a link and trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "baseline_data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}