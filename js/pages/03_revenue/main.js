import { updatePageState } from '../../utils/storage-handlers.js'
import { hideWelcomeButtons } from '../../components/welcome/welcome.js'
import { updateSubtitle } from '../../components/header/header.js'
import { showPrompt, updatePrompt, updatePromptButtons, addPromptButtonAction } from '../../components/prompt/prompt.js'
import { showNavButtons } from '../../components/nav_buttons/nav_buttons.js'
import { loadNewInitiatives } from '../02_new_initiatives/main.js'
import { hideTable } from '../../components/table/table.js'
import { hideSideBar } from '../../components/sidebar/sidebar.js'
import { formatCurrency } from '../../utils/utils.js'

import { REVENUE } from '../../init.js'

export function loadRevenuePage() {

    //update page state
    updatePageState('revenue');

    // prepare page view
    hideWelcomeButtons();
    showPrompt();
    showNavButtons();
    hideTable('main-table');
    hideSideBar();

    // update page text
    updateSubtitle('Revenue Projections');
    // TODO: update to make dynamic
    updatePrompt(`Your revenue projection for FY26 is ${formatCurrency(REVENUE, true)}`);
    updatePromptButtons('Confirm and continue.', "This doesn't look right");

    // clicking 'confirm and continue' will also take us to the next page
    addPromptButtonAction('option1', loadNewInitiatives);

}