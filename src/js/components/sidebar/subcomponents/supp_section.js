import { Supplemental } from "../../../models";
import { formatCurrency } from "../../../utils/common_utils";
import { visitPage } from "../../../views/view_logic";

export const SuppSection = {
    html() {
        var supp = new Supplemental;
        return `
            <div class='sidebar-stat-line' id="supp-revenue">
                <span class="stat-label">Estimated revenues:</span> 
                <span class="stat">${formatCurrency(supp.revenue())}</span>
                <i class="fas fa-edit edit-supp" title="Edit"></i>
            </div>
            <div class='sidebar-stat-line' id="supp-expenses">
                <span class="stat-label">Esimated expenditures:</span> 
                <span class="stat">${formatCurrency(supp.expenses())}</span>
                <i class="fas fa-edit edit-supp" title="Edit"></i>
            </div>
            <div class='sidebar-stat-line' id="supp-total">
                <span class="stat-label">Total supplemental:</span> 
                <span class="stat">${formatCurrency(supp.total())}</span>
            </div>`
    },

    linkEditBtns() {
        let btns = document.querySelectorAll('.edit-supp');
        btns.forEach((btn) => {
            btn.addEventListener('click', function() {
                visitPage('new-inits');
            });
        });
    },

    update() {
        const suppDiv = document.querySelector('#supp-stats');
        suppDiv.innerHTML = this.html();
        this.linkEditBtns();
    }
}

export default SuppSection;