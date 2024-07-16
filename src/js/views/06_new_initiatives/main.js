
import { initializePageView, setUpModal, setUpForm, setUpTable, removeModalLinks, removePromptButtonListeners } from './helpers.js'
import { CurrentPage } from '../../utils/data_utils/local_storage_handlers.js'


// set up page and initialize all buttons
export function loadNewInitiatives() {
    CurrentPage.update('new-inits');
    initializePageView();
    setUpModal();
    setUpForm();
    setUpTable();
}

export function cleanUpInitiativesPage() {
    removeModalLinks();
    // remove event listeners on prompt buttons
    removePromptButtonListeners();
}