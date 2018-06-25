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
        
        <span v-if="info != null">
       <div class="card">
            <h4>Global Info</h4>
                <div class="col-12">
                    smart_contract_balance: {{ info.smart_contract_balance | nas }}
                </div>
                <div class="col-12">
                    sell_price_nas_per_resource: {{ info.sell_price_nas_per_resource | nas }}
                </div>
        </div> 

        <div class="card mt-5" v-if="!info.active_ico">
            <h4>Start ICO</h4>
            <div class="row mt-2">
                <div class="col">
                    Name: <input id="name" type="text">
                </div>
                <div class="col">
                    Ticker: <input id="ticker" type="text">
                </div>
            </div>
            <div class="row mt-2">
                <div class="col">
                    <button v-on:click="startICO()">Start ICO</button>
                </div>
            </div>
        </div>

        <div class="card mt-5 text-left" v-if="info.active_ico">
            <h4>{{ info.active_ico.name }} ({{ info.active_ico.ticker }})</h4>
            <div class="row mt-2">
                <div class="col-12">
                    my_resources: {{ info.active_ico.my_resources | count }}
                </div>
                <div class="col-12">
                    my_production_rate: {{ info.active_ico.my_production_rate | count }}
                </div>
                <div class="col-12">
                    my_bonus: {{ info.active_ico.my_bonus | percent }}
                </div>
                <div class="col-12">
                    my_total_production_rate: {{ info.active_ico.my_total_production_rate | count }}
                </div>
            </div>
        </div>
        
        <div class="card mt-5" v-if="info.active_ico">
            <h4>Event</h4>
            <div class="row mt-2">
                <div class="col" v-if="!info.current_event || info.current_event.number_of_blocks_remaining == 0 || info.current_event.user_has_redeemed">
                    Next Event starts in: {{ info.blocks_till_next_event | count }} blocks
                </div>
                <span v-else>
                    <div class="col-12">
                        Reward: {{ info.current_event.reward_percent | percent }}
                    </div>
                    <div class="col-12">
                        Min Reward: {{ info.current_event.min_reward | count }}
                    </div>
                    <div class="col-12">
                        Max Reward: {{ info.current_event.max_reward | count }}
                    </div>
                    <div class="col-12">
                        Number of blocks this event: {{ info.current_event.number_of_blocks | count }}
                    </div>
                    <div class="col-12">
                        Blocks Remaining: {{ info.current_event.number_of_blocks_remaining | count }}
                    </div>
                    <div class="col-12">
                        <button @click="redeemEvent()">Redeem</button>
                    </div>
                </span>
            </div>
        </div>

        <div class="card mt-5 text-left" v-if="info.active_ico">
            <h4>NAS</h4>
            <div class="row">
                <div class="col-12">
                    my_resources_nas_value: {{ info.active_ico.my_resources_nas_value | nas }} 
                </div>
                <div class="col-12 mt-2" v-if="isMyGame()">
                    <button @click="exitScam()" class="btn btn-primary">Exit Scam</button>
                </div>
            </div>
        </div>
        <div class="card mt-5 text-left" v-for="item in info.items" :key="item.name">
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
                <span v-if="info.active_ico">
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
                        <input type="range" v-model="selections[item.name].number_to_buy" @input="$forceUpdate()" min="1" :max="item.user_max_can_afford">
                    </div>
                    <div class="col-12" v-if="isMyGame()">
                        <button v-on:click="buy(item, selections[item.name].number_to_buy)" class="btn btn-secondary" v-bind:disabled="item.user_max_can_afford < 1">
                            Buy {{ selections[item.name].number_to_buy | count }}
                        </button>
                        <button v-on:click="buy(item, null)" class="btn btn-secondary" v-bind:disabled="item.user_max_can_afford < 1">Buy Max</button>
                        +{{ getBuyProductionGain(item) | count }}/s for {{ getBuyPrice(item) | price }}
                    </div>
                    <div class="col-12" v-if="isMyGame()">
                        <input type="number" v-model="selections[item.name].number_to_buy_with_nas" @input="$forceUpdate()">
                        <button v-on:click="buyWithNas(item, selections[item.name].number_to_buy_with_nas)" class="btn btn-secondary">
                            Buy for {{ getBuyWithNasCost(item) | nas }}
                        </button>
                        Buy {{ selections[item.name].number_to_buy_with_nas | count }} for +{{ getBuyProductionGainWithNas(item) | count }}/s 
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
var game = require("../logic/game.js");
var neb = require("../logic/HardlyNeb.js");
var refresh_count = 0;

import Navbar from './Navbar.vue';
import FundsContainer from './FundsDisplay';

export default {
    name: 'Debug',
    data () {
        return {
            info: null,
            selections: {},
            amount_to_invest: 0,
            method_to_call: "",
            method_to_call_args: "",
            best_known_scammers: [],
            coin_market_caps: [],
            explorer_smart_contract_url: null,
            smart_contract_address: null
        }
    },
    components: {
        Navbar,
        FundsContainer
    },
    methods: {
        log(message)
        {
            console.log("---------------------------------------");
            console.log("---------------------------------------");
            console.log("---------------------------------------");
            console.log(message);
            console.log("---------------------------------------");
        },
        isMyGame()
        {
            return game.isMyGame();
        },
        startICO()
        {
            game.startICO($("#name").val(), $("#ticker").val(), onTxPosted, onSuccess, onError);
        },
        getInfo()
        {
            game.getInfo((resp) =>
            {
                this.info = resp;
                if(!this.info.active_ico && !game.isMyGame())
                {
                    game.setTicker(null);
                    // use router
                    window.location.hash = window.location.hash.substring(window.location.hash.indexOf("?"));
                }

                for(var i = 0; i < this.info.items.length; i++)
                {
                    var item = this.info.items[i];
                    var selection = this.selections[item.name];
                    if(selection == null)
                    {
                        this.selections[item.name] = {
                            number_to_buy: 0
                        };
                    }

                    if(this.selections[item.name].number_to_buy_with_nas == null)
                    {
                        this.selections[item.name].number_to_buy_with_nas = 1;
                    }

                    if(item.user_max_can_afford <= 0)
                    {
                        this.selections[item.name].number_to_buy = 0;
                    }
                    else if(!this.selections[item.name].number_to_buy)
                    {
                        this.selections[item.name].number_to_buy = 1;
                    }
                }
            }, this.log);
        },
        buy(item, count)
        {
            game.buy(item.name, count, onTxPosted, onSuccess, onError);
        },
        buyWithNas(item, count)
        {
            game.buyWithNas(item, count, onTxPosted, onSuccess, onError);
        },
        invest()
        {
            game.invest(this.amount_to_invest, onTxPosted, onSuccess, onError);
        },
        callMethodAsWrite()
        {
            if(this.method_to_call_args == "")
            {
                this.method_to_call_args = null;
            }
            var args = null;
            if(this.method_to_call_args)
            {
                args = this.method_to_call_args.split(",");
            }
            neb.nebWrite(this.method_to_call, args, onTxPosted, 0, onSuccess, onError);
        },
        callMethodAsRead()
        {
            if(this.method_to_call_args == "")
            {
                this.method_to_call_args = null;
            }
            var args = null;
            if(this.method_to_call_args)
            {
                args = this.method_to_call_args.split(",");
            }
            neb.nebRead(this.method_to_call, args, onSuccess, onError);
        },
        exitScam()
        {
            game.exitScam(onTxPosted, onSuccess, onError);
        },
        getBuyPrice(item)
        {
            return game.getBuyPrice(item, this.selections[item.name].number_to_buy);
        },
        getBuyWithNasCost(item)
        {
            return game.getBuyWithNasCost(item, this.selections[item.name].number_to_buy_with_nas);
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
            return this.selections[item.name].number_to_buy * item.resources_per_s;
        },
        getBuyProductionGainWithNas(item)
        {
            return this.selections[item.name].number_to_buy_with_nas * item.resources_per_s;
        },
        redeemEvent()
        {
            game.redeemEvent(onTxPosted, onSuccess, onError);
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
        this.explorer_smart_contract_url = 
            "https://explorer.nebulas.io/#" + (game.getIsTestnet() ? '/testnet' : '') + "/address/" + this.smart_contract_address;
        var index = window.location.hash.lastIndexOf("?");
        if(index >= 0)
        {
            var ticker = window.location.hash.substring(window.location.hash.lastIndexOf("?") + 1);
            if(ticker)
            {
                game.setTicker(ticker);
            }
        }

        this.getInfo();
        setInterval(this.getInfo, 10000);

        this.getBestKnownScammers();
        this.getCoinMarketCaps();
    }
}

var status_cooldown;
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
        status_cooldown = setTimeout(function() 
        {
            hideStatus();
            if(onTimeout)
            {
                onTimeout();
            }
        }, timeout);
    }
}

function onTxPosted(resp) 
{
    showStatus("Tx Posted", resp.txhash, 5000);
}

function onError(error)
{ // onError
    showStatus("Error", error, 15000);
}

function onSuccess(resp)
{ // onSuccess
    showStatus("Success", JSON.stringify(resp), 3000);
}


// From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x, decimals) => 
{
    if(decimals == null)
    {
        decimals = 0;
    }
    var parts = Number.parseFloat(x).toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

var token_denominator = 1000000000000000000;

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
    var x = number / token_denominator;
    return numberWithCommas(x, digits) + " " + unit;
}


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
/* .card
{
    background-color: black;
} */
</style>
