var neb = require("../logic/HardlyNeb.js");
let settings = require("../static/settings.js");

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

    // TODO check write calls before posting
    // Consider using sub
    // TODO is ticker name available?
    setTicker(_ticker)
    {
        ticker = _ticker;
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
        return item.start_price * (Math.pow(quantity, 3) / 3 + Math.pow(quantity, 2) / 2 + quantity / 6);
    },

    getBuyPrice(item, quantity)
    {
        if(!quantity)
        {
            quantity = 1;
        } else
        {
            quantity = parseInt(quantity);
        }
        var item_count = parseInt(item.user_holdings);
        var max = item_count + quantity;
        return this.getTotalCostFor(item, max) - this.getTotalCostFor(item, item_count);
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

    invest(amount, onTxPosted, onSuccess, onError)
    {
        neb.nebSend(neb_contract.contract, onTxPosted, amount, onSuccess, onError);
    },

    exitScam(onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("exitScam", null, onTxPosted, 0, onSuccess, onError);
    }
}
