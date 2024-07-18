
import Prompt from '../../components/prompt/prompt.js'
import Body from "../../components/body/body.js";
import Subtitle from "../../components/header/header.js";
import { visitPage } from "../view_logic.js";
import { Accordion } from "../../components/accordion/accordion.js";
import { downloadXLSX } from "../../utils/data_utils/XLSX_handlers.js";
import Table from '../../components/table/table.js';

export function summaryView(){
    Body.reset();
    Accordion.build();
    Accordion.show();

    // prompt buttons
    Prompt.Text.update('');
    Prompt.show();
    Prompt.Buttons.Left.updateText('Download Excel');
    Prompt.Buttons.Right.updateText('Go back to home');

    // update page text
    Subtitle.update('Summary');
    // add button links
    Prompt.Buttons.Right.addAction(returnToWelcome);
    Prompt.Buttons.Left.addAction(downloadXLSX);

    // add a button to add more initiatives
    Table.Buttons.AddRow.show();
    Table.Buttons.AddRow.updateText('Add another initiative');
    
}

const returnToWelcome = () => {visitPage('welcome')}

export function disablePromptButtons(){
    Prompt.Buttons.Right.removeAction(returnToWelcome);
    Prompt.Buttons.Left.removeAction(downloadXLSX);
}