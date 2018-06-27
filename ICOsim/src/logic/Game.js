const neb = require("../logic/HardlyNeb.js");
let settings = require("../static/settings.js");
const token_denominator = 1000000000000000000;

let ticker;

module.exports = 
{
    // Call to store a ticker to use going forward (e.g. if it was provided in the URL)
    setTicker(_ticker)
    {
        ticker = _ticker;
    },
    
    //#region Write
    buy(item, count, onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("buy", [item.name, count], onTxPosted, 0, onSuccess, onError);
    },

    buyWithNas(item, count, onTxPosted, onSuccess, onError)
    {
        let cost = this.getBuyWithNasCost(item, count) / token_denominator;
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

    launchICO(name, ticker, onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("launchICO", [name, ticker], function(resp)
        {
            onTxPosted(resp);
        }, 0, onSuccess, onError);
    },

    redeemEvent(onTxPosted, onSuccess, onError)
    {
        neb.nebWrite("redeemEvent", null, onTxPosted, 0, onSuccess, onError);
    },
    //#endregion

    //#region Read
    isWalletInstalled()
    {
        return neb.isWalletInstalled();
    },

    getExplorerURL()
    {
        if(neb_contract.apiUrl.indexOf("mainnet") >= 0)
        {
            return "https://explorer.nebulas.io/#";
        }
        else if(neb_contract.apiUrl.indexOf("testnet") >= 0)
        {
            return "https://explorer.nebulas.io/#/testnet";
        }
        else
        {
            return "http://159.69.21.59:8081/#";
        }
    },
    
    getBlockExplorerURLForTx(txhash)
    {
        return this.getExplorerURL() + "/tx/" + txhash;
    },
    
    getBlockExplorerURLForContract()
    {
        return this.getExplorerURL() + "/address/" + this.getSmartContractAddress();
    },
    
    getSmartContractAddress()
    {
        return neb_contract.contract;
    },
    
    getIsTickerAvailable(ticker, onSuccess, onError)
    {
        return neb.nebRead("getIsTickerAvailable", [ticker], onSuccess, onError);
    },
    
    getCoinMarketCaps(start_index, count, onSuccess, onError)
    {
        neb.nebRead("getCoinMarketCaps", null, function(icos)
        {
            for(var i = 0; i < icos.length; i++)
            {
                icos[i].market_cap = new BigNumber(icos[i].market_cap).div(100);
            }
            onSuccess(icos);
        }, onError);
    },
    
    getBestKnownScammers(start_index, count, onSuccess, onError)
    {
        neb.nebRead("getBestKnownScammers", null, function(scammers)
        {
            for(var i = 0; i < scammers.length; i++)
            {
                scammers[i].nas_redeemed = new BigNumber(scammers[i].nas_redeemed);
            }
            onSuccess(scammers);
        }, onError);
    },
    
    getTotalCostFor(item, quantity)
    {
        quantity = new BigNumber(quantity);
        return new BigNumber(item.start_price).mul(quantity).mul(quantity);
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
        let item_count = parseInt(item.user_holdings);
        let max = item_count + quantity;
        return this.getTotalCostFor(item, max).sub(this.getTotalCostFor(item, item_count));
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
        return item.nas_price.mul(quantity);
    },
    
    getGame(onSuccess, onError)
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
                if(info.current_event)
                {
                    info.current_event.expected_reward = (info.current_event.reward_percent/100) * info.active_ico.resources;
                    if(info.current_event.expected_reward < info.current_event.min_reward)
                    {
                        info.current_event.expected_reward = info.current_event.min_reward;
                    }
                    else if(info.current_event.expected_reward > info.current_event.max_reward)
                    {
                        info.current_event.expected_reward = info.current_event.max_reward;
                    }
                }
                info.active_ico.resources = new BigNumber(info.active_ico.resources);
            }

            for(let i = 0; i < info.items.length; i++)
            {
                let item = info.items[i];
                item.start_price = new BigNumber(item.start_price);
                if(item.resources_per_s)
                {
                    item.resources_per_s = new BigNumber(item.resources_per_s);
                }
                item.nas_price = new BigNumber(item.nas_price);
                item.user_holdings = parseInt(item.user_holdings);
                item.user_price = new BigNumber(item.user_price);
                if(item.user_item_bonus)
                {
                    item.user_item_bonus = new BigNumber(item.user_item_bonus);
                }
                else
                {
                    item.user_item_production = new BigNumber(item.user_item_production);
                }
                item.user_max_can_afford = parseInt(item.user_max_can_afford);
            }

            onSuccess(info);
        }, onError);
    },
    //#endregion

    //#region For debugging:
    directNebWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError) 
    {
        neb.nebWrite(method, args, onTxPosted, nas_to_send, onSuccess, onError);
    },
    
    directNebRead(method, args, onSuccess, onError) 
    {
        neb.nebRead(method, args, onSuccess, onError) 
    },
    //#endregion
}
