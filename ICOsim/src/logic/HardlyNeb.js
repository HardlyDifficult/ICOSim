let settings = require("../static/settings.js");

// TODO if error == 'contract check failed' (sp?) then mainnet vs testnet bug.
let NebPay = require("nebPay");
let nebPay = new NebPay();


// The nebulas API, used for signing transactions, etc
var nebulas = require("nebulas");
var neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(neb_contract.apiUrl));

module.exports = 
{
    nebTest(method, args)
    {
        nebRead(method, args, function(resp, error) 
        {
            console.log("---------------------------------------------------");
            console.log("resp: " + global.JSON.stringify(resp) + "; error: " + error);
        });
    },

    nebGetTxStatus(txhash, listener, error)
    {
        neb.api.getTransactionReceipt({hash: txhash}).then((resp) =>
        {
            if(resp.status > 1) 
            {
                setTimeout(() =>
                {
                    this.nebGetTxStatus(txhash, listener, error);
                }, 3000);
                return;
            }
            
            if(!resp.execute_error)
            {
                listener(resp);
            } 
            else
            {
                error(resp.execute_error);
            }
        }).catch(error);
    },
    
    nebWrite(method, args, listener, nas_to_send, receipt, error) 
    {
        if(!args)
        {
            args = null;
        }

        nebPay.call(neb_contract.contract, nas_to_send, method, global.JSON.stringify(args),
        {
            listener: (resp) =>
            { 
                if(!resp.txhash)
                {
                    if(error)
                    {
                        error(resp);
                    }
                    return;
                }
                if(listener)
                {
                    listener(resp);
                }         
                if(receipt)
                {
                    this.nebGetTxStatus(resp.txhash, receipt, error);
                }
            }
        });
    },

    nebSend(to, listener, value, receipt, error)
    {
        nebPay.pay(to, value, {listener: (resp) =>
        {
            if(!resp.txhash)
            {
                if(error)
                {
                    error(resp);
                }
                return;
            }
            if(listener)
            {
                listener(resp);
            }
            if(receipt)
            {
                this.nebGetTxStatus(resp.txhash, receipt, error);
            }
        }});           
    },

    nebRead(method, args, listener, onError) 
    {
        if(!args)
        {
            args = null;
        }

        nebPay.simulateCall(neb_contract.contract, 0, method, global.JSON.stringify(args), {
            listener: (resp) =>
            {
                var error = resp.execute_err;
                var result;
                if(!error) 
                {
                    if(resp.result) 
                    {
                        result = global.JSON.parse(resp.result);
                    }
                } 
                else 
                {
                    onError(error);
                    console.log("Error: " + error);
                    return;
                }
            
                listener(result);
            }
        });
    },

    nebReadAnon(method, args, listener) 
    {
        if(!args)
        {
            args = null;
        }

        neb.api.call({
            from: neb_contract.contract, // Using the contract here so this can be called without loggin on.
            to: neb_contract.contract,
            value: 0,
            nonce: 0, // Nonce is irrelavant when read-only (there is no transaction charge)
            gasPrice: gas_price,
            gasLimit: gas_limit,
            contract: {function: method, args: global.JSON.stringify(args)} 
        }).then((resp) =>
        {
            var error = resp.execute_err;
            var result;
            if(resp.result) 
            {
                result = global.JSON.parse(resp.result);
            } 
            else 
            {
                console.log("Error: " + error);
            }
        
            listener(result, error, args);      
        });        
    },
}