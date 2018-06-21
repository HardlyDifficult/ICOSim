var neb = require("../logic/HardlyNeb.js");
let settings = require("../static/settings.js");

module.exports = 
{
    getInfo(onSuccess, onError)
    {
        neb.nebRead("getInfo", null, function(info) 
        {
            info.items.sort(function(a, b)
            {
                return a.sort_id - b.sort_id;
            });
            info.my_total_production_rate = info.my_production_rate * (1 + info.my_bonus / 100);
            onSuccess(info);
        }, onError);
    },

    startICO(name, ticker, onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("createICO", [name, ticker], function(resp)
        {
            onTxPosted(resp);
            console.log(resp);
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
