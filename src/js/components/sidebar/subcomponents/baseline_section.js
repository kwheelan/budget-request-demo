import { FISCAL_YEAR } from "../../../constants";
import { Baseline, FundLookupTable, Fund, CurrentFund } from "../../../models";
import { formatCurrency } from "../../../utils/common_utils";
import { visitPage } from "../../../views/view_logic";

export const BaselineSection = {
    _data: new Baseline(),
    _genFund : new Fund(1000),

    get data() {
        this._data = new Baseline();
        return this._data;
    },

    set data(newData) {
        this._data = newData;
    },

    get genFund() {
        this._genFund = new Fund(1000);
        return this._genFund;
    },

    set genFund(newFund) {
        this._genFund = newFund;
    },

    target_html() {
        return `
            <div class='sidebar-stat-line' id="baseline-total">
                <span class="stat-label">Baseline total:</span> 
                <span class="stat">${formatCurrency(this.data.total())}</span>
            </div>
            <div class='sidebar-stat-line' id="target">
                <span class="stat-label">FY${FISCAL_YEAR} GF target:</span> 
                <span class="stat">${formatCurrency(Baseline.target())}</span>
            </div>
            <div class='sidebar-stat-line' id="GF-total">
                <span class="stat-label">Current GF total:</span> 
                <span class="stat">${formatCurrency(this.genFund.getTotal())}</span>
            </div>
            <br>`;
    },
    
    fund_html(fund) {
        return `
            <h6>${FundLookupTable.getName(fund.fund)}</h6>
            <hr>
            <div class='sidebar-stat-line revenue'>
                <span class="stat-label">Projected revenues:</span> 
                <span class="stat">${formatCurrency(fund.getRevenue())}</span>
                <i class="fas fa-edit edit-icon" title="Edit"></i>
            </div>
            <div class='sidebar-stat-line personnel'>
                <span class="stat-label">Personnel cost:</span> 
                <span class="stat">${formatCurrency(fund.getPersonnelCost())}</span>
                <i class="fas fa-edit edit-icon" title="Edit"></i>
            </div>
            <div class='sidebar-stat-line nonpersonnel'>
                <span class="stat-label">Non-personnel cost:</span> 
                <span class="stat">${formatCurrency(fund.getNonPersonnelCost())}</span>
                <i class="fas fa-edit edit-icon" title="Edit"></i>
            </div>
            <div class='sidebar-stat-line fund-total'>
                <span class="stat-label">Fund total:</span> 
                <span class="stat">${formatCurrency(fund.getTotal())}</span>
            </div>
            <br>`;
    },

    linkEditBtns() {
        let btns = document.querySelectorAll('.edit-icon');
        btns.forEach((btn) => {
            // Get the fund from the div the button is in
            let fund = btn.closest('.fund-div').id.replace('fund_', '');
            let page = btn.closest('.sidebar-stat-line').classList[1];
    
            btn.addEventListener('click', function() {
                CurrentFund.update(fund);
                visitPage(page);
            });
        });
    },

    update() {
        const baselineDiv = document.querySelector('#baseline-stats');
        baselineDiv.innerHTML = this.target_html();

        this.data.funds.forEach((fund) => {
            var fundDiv = document.createElement('div');
            fundDiv.id = `fund_${fund.fund}`;
            fundDiv.classList.add('fund-div');
            fundDiv.innerHTML = this.fund_html(fund);
            baselineDiv.appendChild(fundDiv);
        });

        if(this.genFund.getTotal() <= Baseline.target()){
            document.querySelector('#GF-total .stat').style.color = "green";
            document.querySelector('#fund_1000 .sidebar-stat-line:last-of-type .stat').style.color = "green";
        } else {
            document.querySelector('#GF-total .stat').style.color = "red";
            document.querySelector('#fund_1000 .sidebar-stat-line:last-of-type .stat').style.color = "red";
        }
        this.linkEditBtns();
    }
};