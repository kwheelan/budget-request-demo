import { updatePageState } from "../../utils/storage-handlers.js";
import { updateSubtitle } from '../../components/header/header.js'
import Prompt from '../../components/prompt/prompt.js'
import { initializeWelcomePage } from "../00_welcome/main.js";
import Body from "../../components/body/body.js";

export function loadSummaryPage(){
    //update page state
    updatePageState('summary');

    // prepare page view
    Body.clearAll();
    Prompt.Buttons.Left.updateText('Submit');
    Prompt.Buttons.Right.updateText('Go back and edit');

    // update page text
    updateSubtitle('Summary');
    // TODO: update to make dynamic
    Prompt.Text.update(`Placeholder for summary and any issues.`);
    Prompt.Buttons.Right.addAction(initializeWelcomePage);
}