var neb = require("../logic/HardlyNeb.js");
let settings = require("../static/settings.js");
const token_denominator = 1000000000000000000;

var ticker;

module.exports = 
{
    getIsTestnet()
    {
        return neb_contract.apiUrl.indexOf("testnet") >= 0;
    },

    getSmartContractAddress()
    {
        return neb_contract.contract;
    },

    // TODO is ticker name available?
    // TODO can we get user's balance?

    // TODO check write calls before posting
    // Consider using sub
    setTicker(_ticker)
    {
        ticker = _ticker;
    },

    isMyGame()
    {
        return ticker == null;
    },

    getCoinMarketCaps(start_index, count, onSuccess, onError)
    {
        neb.nebRead("getCoinMarketCaps", null, onSuccess, onError);
    },

    getBestKnownScammers(start_index, count, onSuccess, onError)
    {
        neb.nebRead("getBestKnownScammers", null, onSuccess, onError);
    },

    getTotalCostFor(item, quantity)
    {
        return item.start_price * (quantity * quantity);
    },

    getBuyPrice(item, quantity)
    {
        if(!quantity)
        {
            quantity = 1;
        } 
        else
        {
            quantity = parseInt(quantity);
        }
        var item_count = parseInt(item.user_holdings);
        var max = item_count + quantity;
        return this.getTotalCostFor(item, max) - this.getTotalCostFor(item, item_count);
    },
    
    getBuyWithNasCost(item, quantity)
    {
        if(!quantity)
        {
            quantity = 1;
        } 
        else
        {
            quantity = parseInt(quantity);
        }
        return item.nas_price * quantity;
    },

    getInfo(onSuccess, onError)
    {
        neb.nebRead("getInfo", [ticker], function(info) 
        {
            info.items.sort(function(a, b)
            {
                return a.sort_id - b.sort_id;
            });
            if(info.active_ico)
            {
                info.active_ico.my_total_production_rate = info.active_ico.my_production_rate * (1 + info.active_ico.my_bonus / 100);
            }
            onSuccess(info);
        }, onError);
    },

    startICO(name, ticker, onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("launchICO", [name, ticker], function(resp)
        {
            onTxPosted(resp);
        }, 0, onSuccess, onError);
    },

    buy(name, count, onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("buy", [name, count], onTxPosted, 0, onSuccess, onError);
    },

    buyWithNas(item, count, onTxPosted, onSuccess, onError)
    {
        var cost = this.getBuyWithNasCost(item, count) / token_denominator;
        neb.nebWrite("buyWithNas", [item.name, count], onTxPosted, cost, onSuccess, onError);
    },

    invest(amount, onTxPosted, onSuccess, onError)
    {
        neb.nebSend(neb_contract.contract, onTxPosted, amount, onSuccess, onError);
    },

    exitScam(onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("exitScam", null, onTxPosted, 0, onSuccess, onError);
    },

    redeemEvent(onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("redeemEvent", null, onTxPosted, 0, onSuccess, onError);
    }
}
