import Prompt from "../components/prompt/prompt.js";
import Sidebar from "../components/sidebar/sidebar.js";
import NavButtons from "../components/nav_buttons/nav_buttons.js";
import Body from "../components/body/body.js";
import Subtitle from "../components/header/header.js";
import Table from "../components/table/table.js";
import Form from "../components/form/form.js";
import Modal from "../components/modal/modal.js";

import { CurrentPage, AccountString } from '../models/'


export class View {

    constructor() {
        // page state in local storage
        this.page_state = '';

        // whether to display
        this.navButtons = true; 
        this.sidebar = true;

        // text to show in the prompt area
        this.prompt = null;

        // subtitle text
        this.subtitle = '';

        // table object of class ViewTable or null
        this.table = null;
    }

    visit() {
        // update page state
        CurrentPage.update(this.page_state);

        // start with a blank page
        Body.reset();
        
        // default to showing navbuttons
        if (this.navButtons) { NavButtons.show(); };
        
        // default to showing sidebar
        if (this.sidebar) { Sidebar.show() };

        // initialize prompt text and buttons
        if (this.prompt) { Prompt.Text.update(this.prompt) };
        
        // initialize table
        if (this.table) { this.table.build(); }

        // show page subtitle
        if (this.subtitle) { Subtitle.update(this.subtitle) };
    }

    cleanup() { return; }

}

export class ViewTable {

    constructor(){
        // Ensure methods retain the correct `this` context
        this.submitNewRow = this.submitNewRow.bind(this);

        this.columns = [
            { title: 'Account String', className: 'account-string' },
            { title: 'Appropriation Name', className: 'approp-name', hide: true },
            { title: 'Appropriation', className: 'approp', hide: true },
            { title: 'Cost Center Name', className: 'cc-name',  hide: true },
            { title: 'Cost Center', className: 'cc',  hide: true },
            { title: 'Fund Name', className: 'fund-name',  hide: true },
            { title: 'Fund', className: 'fund',  hide: true },
            { title: 'Edit', className: 'edit' },
        ];
        
        // whether to add an edit column
        this.addEdit = true ;

        // message to show if there's no saved data
        this.noDataMessage = null;
   
        // text to show for new row button
        this.addButtonText = null ;

        // whether to show as a datatable
        this.dataTable = true;
    }

    async build() {
    // build table from local storage and initialize edit buttons

        // add the add new row button if needed
        if (this.addButtonText) { 
            this.setUpForm();
        }

        // fill table with new data from local storage
        if(await Table.Data.load()) {      

            // create a datatable object
            if(this.dataTable){this.initDataTable()}

            // add an edit column if needed
            if (this.addEdit) { 
                Table.Columns.addAtEnd(Table.Buttons.edit_confirm_btns, 'Edit'); 
                // activate edit buttons
                Table.Buttons.Edit.init(this.actionOnEdit, this.updateTable);
            }
            
            // assign the correct classes based on the table columns
            Table.Columns.assignClasses(this.columns);

            // Apply any update function to make sure sidebar is up to date
            this.updateTable();

        } else {

            // show a message if there's no saved table data for the selected fund
            if (this.noDataMessage) {
                Prompt.Text.update(this.noDataMessage);
            }
        }

    }

    initDataTable() {
        Table.adjustWidth('100%');
        // Initialize Datatables
        if ( !$.fn.dataTable.isDataTable('#main-table') ) {
            $('#main-table').DataTable({
                paging: false, // Disable pagination
                info: false, // Disable table information display
            });
        };
        // Move the search bar outside the table container
        $('#main-table_filter').appendTo('#search-bar-container');
    }

    // placeholder for action on row edit click
    actionOnEdit() { return }

    // update function for the sidebar; default to just saving the table
    updateTable() { Table.save() }

    // extra questions of the form to add a new row
    addCustomQuestions() { return };

    setUpForm() {
        // show add button
        Table.Buttons.AddRow.show();
        Table.Buttons.AddRow.updateText(this.addButtonText);

        // set up modal for form when add button is pressed
        Modal.clear();
        Modal.Link.add('add-btn');
        Modal.Title.update(this.addButtonText);

        // create form
        Form.new('modal-body');

        // add custom questions
        this.addCustomQuestions();
        // add submit button
        Form.SubmitButton.add();

        // Initialize form submission to table data
        Modal.Submit.init(this.submitNewRow);
    }

    editColumns(responses) { 
        // get numbers from account string names
        if(responses['fund-name']){
            responses['fund'] = AccountString.getNumber(responses['fund-name']);
        };
        if(responses['approp-name']){
            responses['approp'] = AccountString.getNumber(responses['approp-name']);
        };
        if(responses['cc-name']){
            responses['cc'] = AccountString.getNumber(responses['cc-name']);
        };
        if(responses['object-name']){
            responses['object'] = AccountString.getNumber(responses['object-name']);
        };
        responses['account-string'] = 
            AccountString.build(responses['approp-name'], 
                                responses['cc-name'], 
                                responses['object-name'], 
                                responses['fund']);
        return responses;
    }

    submitNewRow(event) {
        // get answers from form, hide form, show answers in table
        var responses = Form.fetchAllResponses(event);
        
        // edit inputs from modal
        responses = this.editColumns(responses);
        
        // make sure it's not an empty response
        if (Object.values(responses)[0] != ''){

            // change page view
            Modal.hide();
            
            // add data to table
            Table.Rows.add(responses, this.columns);
            Table.save();
            
            // rebuild table
            this.build();
        }
    }

}