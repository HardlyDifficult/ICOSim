<template>
    <div class='container-fluid text-left'>
        <h1>Debug</h1>

        <div id="status-card" class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="status-card-title">Modal title</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    
            <div class="modal-body" id="status-card-content">
                Hi
            </div>
            </div>
        </div>
        </div>

         <div class="card" v-if="is_wallet_missing">
            <h4>Missing Wallet Extension!</h4>
                <div class="col-12">
                    Panic 
                </div>
        </div> 
        
        <span v-if="game != null">
       <div class="card">
            <h4>Global game</h4>
                <div class="col-12">
                    smart_contract_balance: {{ game.smart_contract_balance | nas }}
                </div>
                <div class="col-12">
                    sell_price_nas_per_resource: {{ game.sell_price_nas_per_resource | nas }}
                </div>
        </div> 

        <div class="card mt-5" v-if="!game.active_ico">
            <h4>Launch ICO</h4>
            <div class="row mt-2">
                <div class="col">
                    Name: <input type="text" v-model="launch_ico_name">
                </div>
                <div class="col">
                    Ticker: <input v-model="launch_ico_ticker" type="text" @change="checkTicker()" @input="checkTicker()">
                    {{ ticker_is_available }}
                </div>
            </div>
            <div class="row mt-2">
                <div class="col">
                    <button v-on:click="launchICO()">Start ICO</button>
                </div>
            </div>
        </div>

        <div class="card mt-5 text-left" v-if="game.active_ico">
            <h4>{{ game.active_ico.name }} ({{ game.active_ico.ticker }})</h4>
            <div class="row mt-2">
                <div class="col-12">
                    my_resources: {{ game.active_ico.my_resources | count }}
                </div>
                <div class="col-12">
                    my_production_rate: {{ game.active_ico.my_production_rate | count }}
                </div>
                <div class="col-12">
                    my_bonus: {{ game.active_ico.my_bonus | percent }}
                </div>
                <div class="col-12">
                    my_total_production_rate: {{ game.active_ico.my_total_production_rate | count }}
                </div>
            </div>
        </div>
        
        <div class="card mt-5" v-if="game.active_ico && (game.current_event || game.blocks_till_next_event)">
            <h4>Event</h4>
            <div class="row mt-2">
                <div class="col" v-if="!game.current_event || game.current_event.number_of_blocks_remaining == 0 || game.current_event.user_has_redeemed">
                    Next Event starts in: {{ game.blocks_till_next_event | count }} blocks
                </div>
                <span v-else>
                    <div class="col-12">
                        Expected Reward: {{ game.current_event.expected_reward | count }}
                    </div>
                    <div class="col-12">
                        Reward: {{ game.current_event.reward_percent | percent }}
                    </div>
                    <div class="col-12">
                        Min Reward: {{ game.current_event.min_reward | count }}
                    </div>
                    <div class="col-12">
                        Max Reward: {{ game.current_event.max_reward | count }}
                    </div>
                    <div class="col-12">
                        Number of blocks this event: {{ game.current_event.length | count }}
                    </div>
                    <div class="col-12">
                        Blocks Remaining: {{ game.current_event.number_of_blocks_remaining | count }}
                    </div>
                    <div class="col-12" v-if="isMyGame()">
                        <button @click="redeemEvent()">Redeem</button>
                    </div>
                </span>
            </div>
        </div>

        <div class="card mt-5 text-left" v-if="game.active_ico">
            <h4>NAS</h4>
            <div class="row">
                <div class="col-12">
                    my_resources_nas_value: {{ game.active_ico.my_resources_nas_value | nas }} 
                </div>
                <div class="col-12 mt-2" v-if="isMyGame()">
                    <button @click="exitScam()" class="btn btn-primary">Exit Scam</button>
                </div>
            </div>
        </div>
        <div class="card mt-5 text-left" v-for="item in game.items" :key="item.name">
            <h5>{{ item.name }}</h5>
            <div class="row mt-2">
                <div class="col-12">
                    start_price: {{ item.start_price | price }}
                </div>
                <div class="col-12" v-if="item.resources_per_s">
                    resources_per_s: {{ item.resources_per_s | count }}/s
                </div>
                <div class="col-12" v-if="item.bonus_multiplier">
                    bonus_multiplier: {{ item.bonus_multiplier | percent }}
                </div>
                <span v-if="game.active_ico">
                    <div class="col-12">
                        <hr>
                    </div>
                    <div class="col-12">
                        user_holdings: {{ item.user_holdings | count }}
                    </div>
                    <div class="col-12">
                        user_price: {{ item.user_price | price }}
                    </div>
                    <div class="col-12" v-if="item.user_item_production">
                        user_item_production: {{ item.user_item_production | count }}
                    </div>
                    <div class="col-12" v-if="item.user_item_bonus">
                        user_item_bonus: {{ item.user_item_bonus | percent }}
                    </div>
                    <div class="col-12">
                        user_max_can_afford: {{ item.user_max_can_afford | count }}
                    </div>
                    <div class="col-12" v-if="isMyGame()">
                        <input type="range" v-model="input_selections[item.name].number_to_buy" @input="$forceUpdate()" min="1" :max="item.user_max_can_afford">
                    </div>
                    <div class="col-12" v-if="isMyGame()">
                        <button v-on:click="buy(item, input_selections[item.name].number_to_buy)" class="btn btn-secondary" v-bind:disabled="item.user_max_can_afford < 1">
                            Buy {{ input_selections[item.name].number_to_buy | count }}
                        </button>
                        <button v-on:click="buy(item, null)" class="btn btn-secondary" v-bind:disabled="item.user_max_can_afford < 1">Buy Max</button>
                        +{{ getBuyProductionGain(item) | count }}/s for {{ getBuyPrice(item) | price }}
                    </div>
                    <div class="col-12" v-if="isMyGame()">
                        <input type="number" v-model="input_selections[item.name].number_to_buy_with_nas" @input="$forceUpdate()">
                        <button v-on:click="buyWithNas(item, input_selections[item.name].number_to_buy_with_nas)" class="btn btn-secondary">
                            Buy for {{ getBuyWithNasCost(item) | nas }}
                        </button>
                        Buy {{ input_selections[item.name].number_to_buy_with_nas | count }} for +{{ getBuyProductionGainWithNas(item) | count }}/s 
                    </div>
                </span>
            </div>
        </div>

        <div class="card mt-5">
            <h4>Best Known Scammers</h4>
            <div class="row mt-2" v-for="scammer in best_known_scammers" v-bind:key="scammer.addr">
                <div class="col-12">
                    Addr: {{ scammer.addr }}
                </div>
                <div class="col-12">
                    NAS redeemed: {{ scammer.nas_redeemed | nas }}
                </div>
                <div class="col-12" v-if="scammer.active_ico">
                    Active ICO: {{ scammer.active_ico }}
                </div>
                <div class="col-12" v-if="scammer.retired_icos.length > 0">
                    Retired ICOs: {{ scammer.retired_icos }}
                </div>
            </div>
        </div> 

        <div class="card mt-5">
            <h4>Coin Market Caps:</h4>
            <div class="row mt-2" v-for="ico in coin_market_caps" v-bind:key="ico.ticker">
                <h5 class="col-12">
                    {{ ico.name }} ({{ ico.ticker }})
                </h5>
                <div class="col-12">
                    id: {{ ico.id }}
                </div>
                <div class="col-12">
                    Player: {{ ico.player_addr }}
                </div>
                <div class="col-12">
                    last_action_date: {{ ico.last_action_date | date }}
                </div>
                <div class="col-12">
                    market_cap: {{ ico.market_cap | count }}
                </div>
                <div class="col-12">
                    resources: {{ ico.resources | count }}
                </div>
                <div class="col-12">
                    total_production_rate: {{ ico.total_production_rate | count }}
                </div>
            </div>
        </div> 
        </span>

        <div class="card mt-5 text-left">
            <h4>Direct Calls</h4>
            <div class="row mt-2">
                <div class="col-12">
                    Method: <input type="text" v-model="method_to_call">
                </div>
                <div class="col-12">
                    Args: <input type="text" v-model="method_to_call_args">
                </div>
                <div class="col-12">
                    <button @click="callMethodAsRead()">Read</button>
                    <button @click="callMethodAsWrite()">Write</button>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col">
                <a v-bind:href="explorer_smart_contract_url">View Smart Contract ({{ smart_contract_address }})</a>
            </div>
        </div>

    </div>
</template>

<script>
let game = require("../logic/game.js");

export default {
    name: 'Debug',
    data () {
        return {
            // data
            game: null,
            best_known_scammers: [],
            coin_market_caps: [],
            explorer_smart_contract_url: null,
            smart_contract_address: null,
            ticker_is_available: false, // for Launch ICO form
            is_wallet_missing: false, // for new user help

            // user input
            input_selections: {}, 
            amount_to_invest: 0,
            method_to_call: "",
            method_to_call_args: "",
            launch_ico_name: "",
            launch_ico_ticker: "",
        }
    },
    components: {
    },
    methods: {
        // Write
        launchICO()
        {
            game.launchICO(this.launch_ico_name, this.launch_ico_ticker, onTxPosted, (resp) =>
            {
                window.location.search = this.launch_ico_ticker; // TODO router..
                onSuccess(resp);
            }, onError);
        },
        buy(item, count)
        {
            game.buy(item, count, onTxPosted, onSuccess, onError);
        },
        buyWithNas(item, count)
        {
            game.buyWithNas(item, count, onTxPosted, onSuccess, onError);
        },
        invest()
        {
            game.invest(this.amount_to_invest, onTxPosted, onSuccess, onError);
        },
        exitScam()
        {
            game.exitScam(onTxPosted, onSuccess, onError);
        },
        redeemEvent()
        {
            game.redeemEvent(onTxPosted, onSuccess, onError);
        },

        // Read
        isMyGame()
        {
            if(!this.game.active_ico)
            {
                return false;
            }
            return this.game.active_ico.is_you;
        },       
        getGame()
        {
            game.getGame((resp) =>
            {
                this.game = resp;

                // TODO use router?
                if(this.game.active_ico)
                {
                    window.location.search = this.game.active_ico.ticker;
                }
                else if(window.location.search)
                {
                    window.location.search = "";  
                }

                for(let i = 0; i < this.game.items.length; i++)
                { // Init default user selections
                    let item = this.game.items[i];
                    let selection = this.input_selections[item.name];
                    if(selection == null)
                    {
                        this.input_selections[item.name] = {
                            number_to_buy: 0
                        };
                    }

                    if(this.input_selections[item.name].number_to_buy_with_nas == null)
                    {
                        this.input_selections[item.name].number_to_buy_with_nas = 1;
                    }

                    if(item.user_max_can_afford <= 0)
                    {
                        this.input_selections[item.name].number_to_buy = 0;
                    }
                    else if(!this.input_selections[item.name].number_to_buy)
                    {
                        this.input_selections[item.name].number_to_buy = 1;
                    }
                }
            });
        },
        getBuyPrice(item)
        {
            return game.getBuyPrice(item, this.input_selections[item.name].number_to_buy);
        },
        getBuyWithNasCost(item)
        {
            return game.getBuyWithNasCost(item, this.input_selections[item.name].number_to_buy_with_nas);
        },
        getBestKnownScammers()
        {
            game.getBestKnownScammers(null, null, (resp) =>
            { 
                this.best_known_scammers = resp;
            }, onError);
        },
        getCoinMarketCaps()
        {
            game.getCoinMarketCaps(null, null, (resp) =>
            {
                this.coin_market_caps = resp;
            }, onError);
        },
        getBuyProductionGain(item)
        {
            return this.input_selections[item.name].number_to_buy * item.resources_per_s;
        },
        getBuyProductionGainWithNas(item)
        {
            return this.input_selections[item.name].number_to_buy_with_nas * item.resources_per_s;
        },
        checkTicker()
        {
            game.getIsTickerAvailable(this.launch_ico_ticker, () =>
            {
                this.ticker_is_available = true;
            }, () =>
            {
                this.ticker_is_available = false;
            })
        },

        // For Debugging
        callMethodAsWrite()
        {
            if(this.method_to_call_args == "")
            {
                this.method_to_call_args = null;
            }
            let args = null;
            if(this.method_to_call_args)
            {
                args = this.method_to_call_args.split(",");
            }
            game.directNebWrite(this.method_to_call, args, onTxPosted, 0, onSuccess, onError);
        },
        callMethodAsRead()
        {
            if(this.method_to_call_args == "")
            {
                this.method_to_call_args = null;
            }
            let args = null;
            if(this.method_to_call_args)
            {
                args = this.method_to_call_args.split(",");
            }
            game.directNebRead(this.method_to_call, args, onSuccess, onError);
        },
    },
    filters: {
        count(value) 
        {
            return numberWithCommas(value);
        },
        date(value)
        {
            return new Date(value).toString();
        },
        percent(value)
        {
            return numberWithCommas(value) + "%";
        },
        decimal(value)
        {
            return numberWithCommas(value, 4);
        },
        price(value)
        {
            return numberWithCommas(value);
        },
        nas(value)
        {
            return formatCoins(value, 18);
        },
    },
    mounted() {
        this.smart_contract_address = game.getSmartContractAddress();
        this.explorer_smart_contract_url = game.getBlockExplorerURLForContract();
        if(window.location.search)
        {
            game.setTicker(window.location.search.substring(1));
        }

        this.getGame();
        setInterval(this.getGame, 10000);

        this.getBestKnownScammers();
        this.getCoinMarketCaps();

        setTimeout(() =>
        { // It takes a second for the wallet game to appear
            this.is_wallet_missing = !game.isWalletInstalled();
        }, 1000);
    }
}

//#region Modal
let status_cooldown;
function hideStatus()
{
    $("#status-card").modal('hide');    
}
function showStatus(title, message, timeout, onTimeout)
{
    if(status_cooldown)
    {
        clearTimeout(status_cooldown);
        status_cooldown = null;
    }

    $("#status-card-title").text(title);
    $("#status-card-content").empty();
    $("#status-card-content").append(message);
    $("#status-card").modal('show');

    if(timeout) 
    {
        status_cooldown = setTimeout(() =>
        {
            hideStatus();
            if(onTimeout)
            {
                onTimeout();
            }
        }, timeout);
    }
}
//#endregion

function onTxPosted(resp) 
{
    showStatus("Tx Posted", resp.txhash, 5000);
}

function onError(error)
{
    showStatus("Error", error, 15000);
}

function onSuccess(resp)
{ 
    showStatus("Success", JSON.stringify(resp), 3000);
}

// From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x, decimals) => 
{
    if(decimals == null)
    {
        decimals = 0;
    }
    let parts = Number.parseFloat(x).toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

let token_denominator = 1000000000000000000;

function formatCoins(number, digits, unit) 
{
    if(!unit)
    {
        unit = "nas";
    }
    if(!digits)
    {
        digits = 8;
    }
    let x = number / token_denominator;
    return numberWithCommas(x, digits) + " " + unit;
}
</script>

<style>
</style>
