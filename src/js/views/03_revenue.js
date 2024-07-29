import { View, ViewTable } from './view_class.js'

import Table from '../components/table/table.js';

export class RevenueView extends View {

    constructor() {
        super();
        this.page_state = 'revenue';
        this.prompt = 'Review and edit revenue line items.';
        this.subtitle = 'Revenues';
        this.table = new RevenueTable();
    }
}

class RevenueTable extends ViewTable {

    constructor() {
        super();

        // add additional revenue columns to the table
        this.columns = this.columns.concat([
            { title: 'Recurring or One-Time', className: 'recurring'},
            { title: 'Object Category', className: 'object-category'},
            { title: 'Departmental Request Total', className: 'request', isCost: true},
            { title: 'Departmental Request Notes', className: 'notes'},
        ]);

        this.noDataMessage = 'No revenues for this fund.'
    }

    // action on row edit click: make cells editable
    actionOnEdit() { 
        Table.Cell.createTextbox('request', true);
        Table.Cell.createTextbox('notes');
        Table.Cell.createDropdown('recurring', ['One-Time', 'Recurring']);
    }
}

export default RevenueView;