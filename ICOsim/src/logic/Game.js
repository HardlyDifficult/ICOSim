var neb = require("../logic/HardlyNeb.js");
let settings = require("../static/settings.js");

module.exports = 
{
    // TODO getICOLeaderboard
    // TODO view someone elses ICO

    getCoinMarketCaps(start_index, count, onSuccess, onError)
    {
        neb.nebRead("getCoinMarketCaps", null, onSuccess, onError);
    },

    getBestKnownScammers(start_index, count, onSuccess, onError)
    {
        neb.nebRead("getBestKnownScammers", null, onSuccess, onError);
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
        var multiple = (max * (max + 1) - item_count * (item_count + 1)) / 2;
        return item.start_price * Math.pow(multiple, item.price_multiple);
    },

    getBuyPriceOld(item, quantity)
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
        var multiple = (max * (max + 1) - item_count * (item_count + 1)) / 2;
        return item.start_price * multiple;
    },

    getInfo(onSuccess, onError)
    {
        neb.nebRead("getInfo", null, function(info) 
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
