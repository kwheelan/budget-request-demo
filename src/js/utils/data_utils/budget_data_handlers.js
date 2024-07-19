export const FundLookupTable = {
    retrieve : function() {
        return JSON.parse(localStorage.getItem('fund-lookup-table')) || {};
    },
    save : function(fundDict){
        localStorage.setItem('fund-lookup-table', JSON.stringify(fundDict));
    },
    update : function(fundData){
        const table = this.retrieve();
        for (let fund of Object.keys(fundData)){
            // add to lookup table if not in there already
            if (!table[fund]){
                // get fund name
                const fundName = fundData[fund][0]['Fund Name'];
                // add fund to dictionary
                table[fund] = {};
                table[fund]['name'] = fundName;
                table[fund]['viewed'] = false;
            }
        }
        // save any updates
        this.save(table);
    },
    reset : function() {
        this.save({});
    },
    getName : function(number){
        if(number == '') { return '' };
        return this.retrieve()[number]['name'];
    },
    listFunds : function(){
        return Object.keys(this.retrieve());
    },
    editFund : function(fund){
        const table = this.retrieve();
        if (table[fund]){
            table[fund]['viewed'] = true;
            this.save(table);
        } else {
            console.error('No fund selected.');
        }
        
    },
    listUneditedFunds : function(){
        const table = this.retrieve();
        const ret = [];
        this.listFunds().forEach(key => {
            if (!table[key]['viewed']){
                ret.push(key);
            }
        });
        return ret;
    },
    fundsLeft : function(){
        return (this.listUneditedFunds().length > 0);
    }
}

// data structure to save the possible service options for the department
export const Services = {
    save : function(services){
        localStorage.setItem('services-list', JSON.stringify(services));
    },
    list : function(){
        return JSON.parse(localStorage.getItem('services-list')) || {};
    }
}