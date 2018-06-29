const settings = require("../static/settings.js");
const log = require("./log.js");

const NebPay = require("nebPay");
const nebPay = new NebPay();

let nebulas = require("nebulas");
let neb = new nebulas.Neb();
neb.setRequest(new nebulas.HttpRequest(neb_contract.apiUrl));

let has_checked_for_wallet = false;
let wallet_check_count = 0;
const timeout_error_message = "Unexpected token < in JSON at position 0";
const auto_retry_time = 3000;
let write_count = 0;

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
        log.debug("REQ nebGetTxStatus: " + txhash);
        neb.api.getTransactionReceipt({hash: txhash}).then((resp) =>
        {
            log.debug("RES nebGetTxStatus: " + txhash);

            if(resp == timeout_error_message || resp.status > 1) 
            {
                setTimeout(() =>
                {
                    console.log("Timeout!  Will retry...");
                    this.nebGetTxStatus(txhash, onSuccess, onError);
                }, auto_retry_time);
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

        let write_id = ++write_count;

        //this.nebRead(method, args, () => 
        completeWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError, write_id)
        //, onError, nas_to_send);
    },

    nebSend(to, onTxPosted, value, onSuccess, onError)
    {
        log.debug("REQ nebSend: " + tx);
        nebPay.pay(to, value, {listener: (resp) =>
        {
            log.debug("RES nebSend: " + tx);

            if(resp == timeout_error_message) 
            {
                setTimeout(() =>
                {
                    console.log("Timeout!  Will retry...");
                    this.nebSend(to, onTxPosted, value, onSuccess, onError);
                }, auto_retry_time);
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

    nebRead(method, args, onSuccess, onError, nas_to_send) 
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
                { // Poll quickly for up to 1 second
                    wallet_check_count++;
                    if(wallet_check_count > 10)
                    {
                        has_checked_for_wallet = true;
                    }
                    this.nebRead(method, args, onSuccess, onError, nas_to_send);
                }, 100);
                return;
            }
        }

        let done = false;
        var read_timeout = setTimeout(() => {
            if(done) 
            {
                return;
            }
            done = true;

            this.nebRead(method, args, onSuccess, onError, nas_to_send)
        }, auto_retry_time);

        log.debug("REQ nebRead: " + method);
        nebPay.simulateCall(neb_contract.contract, nas_to_send, method, global.JSON.stringify(args), {
            listener: (resp) =>
            {
                if(done) 
                {
                    return;
                }
                done = true;
                clearTimeout(read_timeout);
                
                log.debug("RES nebRead: " + method);

                if(resp == timeout_error_message) 
                {
                    setTimeout(() =>
                    {
                        console.log("Timeout!  Will retry...");
                        this.nebRead(method, args, onSuccess, onError, nas_to_send);
                    }, auto_retry_time);
                    return;
                }

                let error = resp.execute_err;
                let result;
                if(!error && resp.result) 
                {
                    result = global.JSON.parse(resp.result);
                } 
                else 
                {
                    if(onError)
                    {
                        onError(error);
                    }
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

        log.debug("REQ nebReadAnon: " + method);
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
            log.debug("RES nebReadAnon: " + method);

            if(resp == timeout_error_message) 
            {
                setTimeout(() =>
                {
                    console.log("Timeout!  Will retry...");
                    this.nebReadAnon(method, args, onSuccess, onError);
                }, auto_retry_time);
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


function completeWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError, write_id)
{
    if(write_id != write_count)
    { // Another write was started, cancel this one
        return;
    }

    log.debug("REQ nebWrite: " + method);
    nebPay.call(neb_contract.contract, nas_to_send, method, global.JSON.stringify(args),
    {
        listener: (resp) =>
        { 
            log.debug("RES nebWrite: " + method);
            if(resp == timeout_error_message) 
            {
                setTimeout(() =>
                {
                    if(write_id != write_count)
                    { // Another write was started, cancel this one
                        return;
                    }
                    console.log("Timeout!  Will retry...");
                    completeWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError, write_id);
                }, auto_retry_time);
                return;
            }
            if(!resp.txhash)
            {
                if(write_id != write_count)
                { // Another write was started, cancel this one
                    return;
                }
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