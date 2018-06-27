const settings = require("../static/settings.js");

// TODO if error == 'contract check failed' (sp?) then mainnet vs testnet bug.
const NebPay = require("nebPay");
const nebPay = new NebPay();

// The nebulas API, used for signing transactions, etc
let nebulas = require("nebulas");
let neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(neb_contract.apiUrl));

let has_checked_for_wallet = false;
const timeout_error_message = "Unexpected token < in JSON at position 0";
const auto_refresh_time = 3000;
// TODO add a throttle.

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
            if(resp == timeout_error_message || resp.status > 1) 
            {
                setTimeout(() =>
                {
                    console.log("Timeout!  Will retry...");
                    this.nebGetTxStatus(txhash, onSuccess, onError);
                }, auto_refresh_time);
                return;
            }
            
            if(!resp.execute_error)
            {
                onSuccess(resp);
            } 
            else
            {
                onError(resp.execute_error);
            }
        }).catch(onError);
    },
    
    nebWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError) 
    {
        if(!args)
        {
            args = null;
        }

        this.nebRead(method, args, 
            () => completeWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError), 
            onError, nas_to_send);
    },

    nebSend(to, onTxPosted, value, onSuccess, onError)
    {
        nebPay.pay(to, value, {listener: (resp) =>
        {
            if(resp == timeout_error_message) 
            {
                setTimeout(() =>
                {
                    console.log("Timeout!  Will retry...");
                    this.nebSend(to, onTxPosted, value, onSuccess, onError);
                }, auto_refresh_time);
                return;
            }

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

    nebRead(method, args, onSuccess, onError = null, nas_to_send = 0) 
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
                { // TODO poll faster, quit after 1 sec
                    has_checked_for_wallet = true;
                    this.nebRead(method, args, onSuccess, onError, nas_to_send);
                }, 1000);
                return;
            }
        }

        nebPay.simulateCall(neb_contract.contract, nas_to_send, method, global.JSON.stringify(args), {
            listener: (resp) =>
            {
                if(resp == timeout_error_message) 
                {
                    setTimeout(() =>
                    {
                        console.log("Timeout!  Will retry...");
                        this.nebRead(method, args, onSuccess, onError, nas_to_send);
                    }, auto_refresh_time);
                    return;
                }

                let error = resp.execute_err;
                let result;
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
            if(resp == timeout_error_message) 
            {
                setTimeout(() =>
                {
                    console.log("Timeout!  Will retry...");
                    this.nebReadAnon(method, args, onSuccess, onError);
                }, auto_refresh_time);
                return;
            }

            let error = resp.execute_err;
            let result;
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

function completeWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError)
{
    nebPay.call(neb_contract.contract, nas_to_send, method, global.JSON.stringify(args),
    {
        listener: (resp) =>
        { 
            if(resp == timeout_error_message) 
            {
                setTimeout(() =>
                {
                    console.log("Timeout!  Will retry...");
                    completeWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError);
                }, auto_refresh_time);
                return;
            }
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
                module.exports.nebGetTxStatus(resp.txhash, onSuccess, onError);
            }
        }
    });
}