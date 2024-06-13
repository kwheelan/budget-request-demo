// import functions
import { initializeWelcomePage } from './pages/00_welcome/main.js';
import { loadNewInitiatives } from './pages/02_new_initiatives/main.js'
import { loadPageState, updatePageState } from './utils/storage-handlers.js'

// running tallies of total spend
let personnel_supp = 0;
let personnel_baseline = 0;
let nonpersonnel_supp = 0;
let nonpersonnel_baseline = 0;
let target = 2000000;
let baseline_revenue = 0;
let supp_revenue = 0;
let supp_total = personnel_supp - supp_revenue;
let baseline_total = personnel_baseline - baseline_revenue;

// page state
var page_state = 'welcome';

document.addEventListener('DOMContentLoaded', function () {

    page_state = loadPageState();
    console.log(page_state);

    switch (page_state){
        case 'welcome':
            initializeWelcomePage();
            break;
        case 'new-inits':
            loadNewInitiatives();
            break;
    }
    

});