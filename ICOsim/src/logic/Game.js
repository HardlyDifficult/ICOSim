var neb = require("../logic/HardlyNeb.js");

module.exports = 
{
    startICO(name, ticker, onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("createICO", [name, ticker], function(resp)
        {
            onTxPosted(resp);
            console.log(resp);
        }, 0, onSuccess, onError);
    }
}
