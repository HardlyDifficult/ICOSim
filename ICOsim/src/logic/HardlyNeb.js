let settings = require("../static/settings.js");

// TODO if error == 'contract check failed' (sp?) then mainnet vs testnet bug.
let NebPay = require("nebPay");
let nebPay = new NebPay();

// The nebulas API, used for signing transactions, etc
var nebulas = require("nebulas");
var neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(neb_contract.apiUrl));

var has_checked_for_wallet = false;

module.exports = 
{
    isWalletInstalled()
    {
        return typeof(webExtensionWallet) !== "undefined";
    },

    nebTest(method, args)
    {
        nebRead(method, args, function(resp, error) 
        {
            console.log("---------------------------------------------------");
            console.log("resp: " + global.JSON.stringify(resp) + "; error: " + error);
        });
    },

    nebGetTxStatus(txhash, onSuccess, onError)
    {
        neb.api.getTransactionReceipt({hash: txhash}).then((resp) =>
        {
            if(resp.status > 1) 
            {
                setTimeout(() =>
                {
                    this.nebGetTxStatus(txhash, onSuccess, onError);
                }, 3000);
                return;
            }
            
            if(!resp.execute_error)
            {
                onSuccess(resp);
            } 
            else
            {
                error(resp.execute_error);
            }
        }).catch(onError);
    },
    
    nebWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError) 
    {
        if(!args)
        {
            args = null;
        }

        this.nebRead(method, args, () => {
            nebPay.call(neb_contract.contract, nas_to_send, method, global.JSON.stringify(args),
            {
                listener: (resp) =>
                { 
                    if(!resp.txhash)
                    {
                        if(onError)
                        {
                            onError(resp);
                        }
                        return;
                    }
                    if(onTxPosted)
                    {
                        onTxPosted(resp);
                    }         
                    if(onSuccess)
                    {
                        this.nebGetTxStatus(resp.txhash, onSuccess, onError);
                    }
                }
            });
        }, onError);
    },

    nebSend(to, onTxPosted, value, onSuccess, onError)
    {
        nebPay.pay(to, value, {listener: (resp) =>
        {
            if(!resp.txhash)
            {
                if(onError)
                {
                    onError(resp);
                }
                return;
            }
            if(onTxPosted)
            {
                onTxPosted(resp);
            }
            if(onSuccess)
            {
                this.nebGetTxStatus(resp.txhash, onSuccess, onError);
            }
        }});           
    },

    nebRead(method, args, onSuccess, onError) 
    {
        if(!args)
        {
            args = null;
        }

        if(!this.isWalletInstalled())
        {
            if(has_checked_for_wallet)
            {
                return this.nebReadAnon(method, args, onSuccess, onError);
            }
            else
            {
                setTimeout(() =>
                {
                    has_checked_for_wallet = true;
                    this.nebRead(method, args, onSuccess, onError);
                }, 1000);
                return;
            }
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
            
                onSuccess(result);
            }
        });
    },

    nebReadAnon(method, args, onSuccess, onError) 
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
            gasPrice: 1000000,
            gasLimit: 200000,
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
                onError(error);
                console.log("Error: " + error);
                return;
            }
        
            onSuccess(result);
        });        
    },
}