import Fund from "./fund.js";

export class Baseline {
    // baseline will just contain a list of funds, each with
    // running tallies for their budgets
    constructor() {
        const allFunds = FundLookupTable.listFunds();
        this.funds = [];
        allFunds.forEach((fund) => { 
            this.funds.push(new Fund(fund));
        });
    } 

    personnel() {
        let total = 0;
        this.funds.forEach(fund => {
            total += fund.getPersonnelCost();
        });
        return total;
    }

    nonpersonnel() {
        let total = 0;
        this.funds.forEach(fund => {
            total += fund.getNonPersonnelCost();
        });
        return total;
    }

    revenue() {
        let total = 0;
        this.funds.forEach(fund => {
            total += fund.getRevenue();
        });
        return total;
    }

    total() {
        return this.nonpersonnel() + this.personnel() - this.revenue();
    }
}

export default Baseline;