<template>
    <div class='container-fluid'>
    <div class="row">
        <div class="fixed-bg"></div><!--super stupid workaround-->
        <div class="col-12">
            <Navbar :color="'black'"/>
            <div class="row" >
                <div class="col-12 hl"></div>
                <div class="col-12" v-if="icos">
                    ICOs:
                        <FundsContainer :places=0 :showdirection=0 :target="ico_count" :mystyle="number_style"/>                    
                    <span class="bullet">•</span>
                    Market Cap: <FundsContainer :jumpprecision="1" :showdirection=0 :target="total_market_cap" :mystyle="number_style"/>
                    <span class="bullet">•</span>
                    Growth: $ <FundsContainer :showdirection=0 :target="total_growth" :mystyle="number_style"/>/s
                    <span class="bullet">•</span>
                    Scammers: 
                        <FundsContainer :jumpprecision="1" :places=0 :showdirection=0 :target="scammer_count" :mystyle="number_style"/>                                        
                    <span class="bullet">•</span>
                    Taken:  <FundsContainer :showdirection=1 :target="total_scammed"  :jumpprecision="0.0000000000000000001" :label="'nas'" :places=18 :mystyle="number_style"/>
                </div>
                <div class="col-12 hl" v-if="icos"></div>
                <div class="col-12" v-if="icos">
                    <h3 class="title" v-if="show_scammers">Top Scammers By NAS Taken</h3>
                    <h3 class="title" v-if="!show_scammers">Top ICOs By Market Capitalization</h3>
                </div>
            </div>
        </div>
        <div class="col-12 table-container" v-if="icos">
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10">
                    <div class="row table-header">
                        <div class="col-2 table-header-el" :class="show_scammers ? '' : 'active'" @click="show_scammers=false">
                            ICOs
                        </div>
                        <div class="col-2 table-header-el" :class="show_scammers ?  'active' : ''" @click="show_scammers=true">
                            Scammers
                        </div>
                    </div>
                    <table class="table cmc-table">
                        <thead>
                            <tr>
                                <th scope="col" class="border-right">#</th>
                                <th scope="col" class="num" v-if="show_scammers">Exit Amount</th>
                                <th scope="col">Ticker(s)</th>
                                <th scope="col" v-if="!show_scammers">Name</th>
                                <th scope="col" class="num" v-if="!show_scammers">Market Cap</th>
                                <th scope="col" class="num" v-if="!show_scammers">Growth</th>
                                <th scope="col" class="num" v-if="!show_scammers">Exit Value</th>
                                <th scope="col" >Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!show_scammers" v-for="(ico, index) in icos" v-bind:key="ico.id">
                                    <td scope="row" class="border-right" >{{index + 1}}</td>
                                    <td scope="row" >
                                        <span v-bind:style="{backgroundColor:ico.ticker_color, borderColor:ico.ticker_border_color}" class="ticker">{{ico.ticker}}</span>
                                    </td>
                                    <td scope="row" class="text-left" >
                                        <router-link class="navbar-icosim" :to="{path:'/ico/' + ico.ticker}">
                                            {{ico.name}}
                                        </router-link>
                                    </td>
                                    <td scope="row" class="num">
                                        <FundsContainer :showdirection=0 :target="ico.market_cap" :mystyle="number_style"/>
                                    </td>
                                    <td scope="row" class="num">
                                        $ <FundsContainer :showdirection=0 :target="ico.total_production_with_bonus" :mystyle="number_style"/>/s
                                    </td>
                                    <td scope="row" class="num">
                                        <FundsContainer v-if="ico.sell_price"  :jumpprecision="0.0000000000000000001" :label="'nas'" :places=18 :showdirection=1 :target="ico.sell_price" :mystyle="number_style"/>                                        
                                    </td>
                                    <td scope="row" >{{ico.player_addr | addr}}</td>
                            </tr>
                            <tr v-if="show_scammers" v-for="(scammer, index) in scammers" v-bind:key="scammer.id">
                                <td scope="row" class="border-right" >{{index + 1}}</td>
                                
                                <td scope="row" class="num">
                                    <FundsContainer :showdirection=1 :target="scammer.nas_redeemed" :label="'nas'" :places=18 :mystyle="number_style"/>                                    
                                </td>
                                    <td>
                                        <span v-for="(ticker, index) in scammer.retired_icos" v-bind:key="ticker">
                                            <span>
                                                <a v-bind:href="'/?' + ticker + '#'">{{ticker}}</a>
                                            </span><span v-if="index != scammer.retired_icos.length - 1">, </span>
                                        </span>
                                    </td>
                                <td scope="row" >{{scammer.addr | addr}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-lg-1"></div>
    </div>
       <Loading  v-if="!icos"/>
      <Footer :style="'color:black'" />
    </div>
</template>

<script>
import {BigNumber} from 'bignumber.js';

import Navbar from './Navbar.vue';
let game = require("../logic/game.js");
import FundsContainer from './FundsDisplay';
import Loading from './Loading';
import Footer from './Footer';
const auto_refresh_time = 10000; // TODO auto refresh
let is_destroyed = false;



  export default {
    name: "CMC",
    props : ['status'],

    data () {
      return {
        show_scammers : false,
        scammers: null,
        icos: null,
        total_market_cap: new BigNumber(0),
        total_growth: new BigNumber(0),
        total_scammed: new BigNumber(0),
        number_style: {
            "background-color":"transparent", 
            "font-size":"1.25rem",
            "color":"black",
            "display": "inline-block",
        },
        icos_last_updated: null,
        ico_count: 0,
        scammer_count: 0,
      };
    },

    components :{
        FundsContainer,
        Loading,
    Footer,
        Navbar,
    },

    methods : {
        getBestKnownScammers()
        {
            game.getBestKnownScammers(null, null, (resp) =>
            { 
                if(is_destroyed)
                {
                    return;
                }
                this.scammers = resp;
                this.total_scammed = new BigNumber(0);
                for(var i = 0; i < this.scammers.length; i++)
                {
                    this.total_scammed = this.total_scammed.plus(this.scammers[i].nas_redeemed);
                }
                this.scammer_count = new BigNumber(this.scammers.length);
                setTimeout(this.getBestKnownScammers, game.auto_refresh_time);
            },
            (error) =>
            {
                if(is_destroyed)
                {
                    return;
                }
                if(!this.scammers)
                { // Retry right away
                    return this.getBestKnownScammers;
                }
                setTimeout(this.getBestKnownScammers, game.auto_refresh_time);
            });
        },
        getCoinMarketCaps()
        {
            game.getCoinMarketCaps(null, null, (resp) =>
            {
                if(is_destroyed)
                {
                    return;
                }
                this.icos = resp;
                this.total_market_cap = new BigNumber(0);
                this.total_growth = new BigNumber(0);
                for(var i = 0; i < this.icos.length; i++)
                {
                    this.icos[i].original_market_cap = this.icos[i].market_cap;
                    this.total_market_cap = this.total_market_cap.plus(this.icos[i].market_cap);
                    this.total_growth = this.total_growth.plus(this.icos[i].total_production_with_bonus);
                    this.estimateSellPrice(this.icos[i]);
                }
                this.ico_count = new BigNumber(this.icos.length);
                this.icos_last_updated = Date.now();

                setTimeout(this.getCoinMarketCaps, game.auto_refresh_time);
            },
            (error) =>
            {
                if(is_destroyed)
                {
                    return;
                }
                if(!this.icos)
                { // Retry right away
                    return this.getCoinMarketCaps;
                }
                setTimeout(this.getCoinMarketCaps, game.auto_refresh_time);
            });
        },
        getSellPrice()
        {
            game.getSellPriceNasPerResource((sell_price) =>
            {
                if(is_destroyed)
                {
                    return;
                }
                this.sell_price = sell_price;

                setTimeout(this.getSellPrice, game.auto_refresh_time);
            },
            (error) =>
            {
                if(is_destroyed)
                {
                    return;
                }
                if(!this.icos)
                { // Retry right away
                    return this.getSellPrice;
                }
                setTimeout(this.getSellPrice, game.auto_refresh_time);
            });
        },
        estimateSellPrice(ico)
        {
            if(this.sell_price)
            {
                ico.sell_price = ico.market_cap.mul(this.sell_price);
            }
        }
   
    },
    mounted() 
    {
        // TODO auto refresh.
        this.getCoinMarketCaps();
        this.getSellPrice();
        this.getBestKnownScammers();

        let interval = setInterval(() =>
        {
            if(is_destroyed)
            {
                clearInterval(interval);
                return;
            }
            if(this.icos)
            {
                let time_passed = (Date.now() - this.icos_last_updated) / 1000;

                this.total_market_cap = new BigNumber(0);
                for(var i = 0; i < this.icos.length; i++)
                {
                    let production = this.icos[i].total_production_with_bonus.mul(time_passed);
                    this.icos[i].market_cap = this.icos[i].original_market_cap.plus(production);
                    this.total_market_cap = this.total_market_cap.plus(this.icos[i].market_cap);
                    this.estimateSellPrice(this.icos[i]);
                }
            }
        }, 100);
    },
    destroyed()
    {
        console.log("CMC destroyed");
        is_destroyed = true;
    }

}
</script>

<style scoped>
    .table-header > [class*='col-'] {
        display: flex;
        flex-direction: column;
    }

    body{
        background-color: white;
    }

    *{
        color:black;
    }

    .table-container{
        margin-top:4em;
    }

    .cmc-row > div{
        padding-top:6px;
        padding-bottom:6px;
        overflow: hidden;
        text-align:left;
    }

    .cmc-table{
        background-color:white;
        border-bottom:1px solid grey;
        border-left:1px solid grey;
        padding-bottom:1px;
    }
    .table-header-el{
        margin-left:15px;
        font-size:1.3em;
        cursor: pointer;
        border-radius: 5px 5px 0 0;
    }
    .table-header-el:hover{
        background-color:#F5F7F8;
    }
    .table-header-el.active{
        border-left: 1px solid grey;
        border-top: 1px solid grey;
        border-right: 1px solid grey;
    }
    .table-header-el.active:hover{
        background-color:white;
    }
    .num{
        text-align:right;
    }
    .hl{
        height:2px;
        background-color:grey;
        margin-top:5px;
        margin-bottom:5px;
    }
    .title{
        color:black;
        font-weight:bold;
    }

    h3{
        margin-top:2em;
        margin-bottom:2em;
    }
    .fixed-bg{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background-color:white;
    }
    .border-right{
        border-right: 1px solid grey;
    }
    .bullet{
        margin-left: .3em;
        margin-right: .3em;
    }
</style>