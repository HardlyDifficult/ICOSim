var neb = require("../logic/HardlyNeb.js");

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
    }
}
