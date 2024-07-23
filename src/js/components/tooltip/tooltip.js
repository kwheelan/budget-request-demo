import { FISCAL_YEAR } from '../../init';
import Cell from '../table/subcomponents/cells';
import { formatCurrency } from '../../utils/common_utils';
import './tooltip.css'

function hideTooltip() {
    document.getElementById('tooltip').style.visibility = 'hidden';
}

function showTooltip() {
    document.getElementById('tooltip').style.visibility = 'visible';
}

function editTooltipText(newText){
    // edit text to display inside tooltip
    const tooltip = document.getElementById('tooltip');
    tooltip.innerHTML = newText;
}

function showAccountString(row){
    const approp = Cell.getText(row, 'approp-name');
    const cc =  Cell.getText(row, 'cc-name');
    const obj =  Cell.getText(row, 'object-name');
    var message = `<strong>Appropriation</strong>: ${approp}<br>
                    <strong>Cost Center</strong>: ${cc}`;
    if (obj) { message += `<br><strong>Object</strong>: ${obj}`}
    editTooltipText(message);
}

function showSalaryProjection(row){
    const general_increase = Cell.getText(row, 'general-increase-rate');
    const merit_increase =  Cell.getText(row, 'merit-increase-rate');
    const current_salary = Cell.getValue(row, 'current-salary');
    const proj_salary = Cell.getValue(row, 'avg-salary');
    if (current_salary){
        var message = `The average salary/wage for this position was 
            ${formatCurrency(current_salary)} as of September 20${FISCAL_YEAR-2}. With two general 
            increases of ${general_increase*100}% and a merit increase of ${merit_increase*100}%, the 
            Budget Office projects that the average annual 
            salary/wage for this position will be ${formatCurrency(proj_salary)} in FY${FISCAL_YEAR}.`;
    } else {
        var message = `The average salary/wage for this position was 
            unknown as of September 20${FISCAL_YEAR-2}, or the position
            did not exist. The Budget Office projects that 
            the average annual salary/wage for this position 
            will be ${formatCurrency(proj_salary)} in FY2026.`
    }

    editTooltipText(message);
}

function showFinalPersonnelCost(row){
    const proj_salary = Cell.getValue(row, 'avg-salary');
    const ftes = Cell.getText(row, 'baseline-ftes');
    const fringe = parseFloat(Cell.getText(row, 'fringe'));
    const avg_benefits = proj_salary * fringe;
    const message = `The total cost captures ${ftes} position(s) at
                    an annual salary/wage of ${formatCurrency(proj_salary)}, 
                    plus fringe benefits that cost ${formatCurrency(avg_benefits)} 
                    per position per year, on average.`
    editTooltipText(message);
}

function showFICA(row){
    const fica = parseFloat(Cell.getText(row, 'fica'));
    const ficaPercentage = (fica * 100).toFixed(2);
    const message = `This total is overtime wages plus overtime salary plus FICA, 
                     which is ${ficaPercentage}% for this cost center.`
    editTooltipText(message);
}

function showCPA(row){
    const cpa = parseFloat(Cell.getText(row, 'cpa'));
    const description = Cell.getText(row, 'cpa-description');
    const vendor = Cell.getText(row, 'vendor');
    const contract_end = Cell.getText(row, 'contract-end');
    const remaining = Cell.getValue(row, 'remaining');
    if (cpa) {
        var message = `<strong>CPA #${cpa}</strong>`;
    } else {
        var message = `No CPA`;
    }
    if (vendor) {message += `<br><strong>Vendor</strong>: ${vendor}`};
    if (description) {message += `<br><strong>Description</strong>: ${description}`};
    if (contract_end) {message += `<br><strong>Contract End Date</strong>: ${contract_end}`}
    if (remaining) {message += `<br><strong>Amount Remaining on Contract</strong>: ${formatCurrency(remaining)}`}

    editTooltipText(message);
}

export const Tooltip = {

    hide : hideTooltip,
    show : showTooltip,

    link : function(element, displayFn) {

        // add class to show cell with an underline, etc
        element.classList.add('tooltip-cell');

        // Create and append the Font Awesome info icon
        // const infoIcon = document.createElement('i');
        // infoIcon.classList.add('fas', 'fa-info-circle', 'info-icon');
        // element.appendChild(infoIcon);

        // Create and append (detail)
        const detail = document.createElement('span');
        detail.classList.add('detail');
        detail.textContent = '(detail)';
        element.appendChild(detail);

        // add event listener to show tooltip on mouseover
        element.addEventListener('click', function (event) {
            const row = event.target.closest('tr');
            displayFn(row);
            showTooltip();
        });
        // and hide when mouse moves off
        element.addEventListener('mouseout', function () {
            hideTooltip();
        });
        // Update tooltip position on mouse move
        element.addEventListener('mousemove', function (event) {
            const tooltip = document.getElementById('tooltip');
            tooltip.style.top = (event.clientY + 10) + 'px';
            tooltip.style.left = (event.clientX + 10) + 'px';
        });
    },
    
    linkAccountStringCol : function() {
        // get all relevant cells
        document.querySelectorAll('.account-string').forEach( (cell) => {
            this.link(cell, showAccountString);
        })
    },

    linkSalaryCol : function() {
        // get all relevant cells
        document.querySelectorAll('.avg-salary').forEach( (cell) => {
            this.link(cell, showSalaryProjection);
        })
    },

    linkTotalPersonnelCostCol : function() {
        // get all relevant cells
        document.querySelectorAll('.total-baseline').forEach( (cell) => {
            this.link(cell, showFinalPersonnelCost);
        })
    },

    linkTotalOTCol : function() {
        // get all relevant cells
        document.querySelectorAll('.total').forEach( (cell) => {
            this.link(cell, showFICA);
        })
    },

    linkCPACol : function() {
        // get all relevant cells
        document.querySelectorAll('.cpa').forEach( (cell) => {
            this.link(cell, showCPA);
        })
    },

    linkAllPersonnel : function() {
        this.linkAccountStringCol();
        this.linkSalaryCol();
        this.linkTotalPersonnelCostCol();
    },

    linkAllOvertime : function() {
        // this.linkAccountStringCol();
        this.linkTotalOTCol();
    },

    linkAllNP : function() {
        this.linkAccountStringCol();
        this.linkCPACol();
    }
}

export default Tooltip