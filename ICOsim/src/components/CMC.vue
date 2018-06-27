<template>
    <div class='container-fluid'>
    <div class="row">
        <div class="fixed-bg"></div><!--super stupid workaround-->
        <div class="col-12">
            <Navbar :color="'black'"/>
            <div class="row">
                <div class="col-12 hl"></div>
                <div class="col-12">
                    <h3 class="title" v-if="show_scammers">Top Scammers By NAS Taken</h3>
                    <h3 class="title" v-if="!show_scammers">Top ICOs By Market Capitalization</h3>
                </div>
            </div>
        </div>
        <div class="col-12 table-container">
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
                                <th scope="col">Ticker</th>
                                <th scope="col">Name</th>
                                <th scope="col" class="num" v-if="show_scammers">Exit</th>
                                <th scope="col" class="num" v-if="!show_scammers">Market Cap</th>
                                <th scope="col" class="num" v-if="!show_scammers">Growth</th>
                                <th scope="col" >Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="!show_scammers" v-for="(ico, index) in icos" v-bind:key="ico.id">
                                    <td scope="row" class="border-right" >{{index + 1}}</td>
                                    <td scope="row" ><span v-bind:style="{backgroundColor:randomColor(ico.ticker), borderColor:randomColor(ico.name + ico.ticker)}" class="ticker">{{ico.ticker}}</span></td>
                                    <td scope="row" class="text-left" >
                                        <a v-bind:href="'/?' + ico.ticker + '#'">{{ico.name}}</a>
                                    </td>
                                    <td scope="row" class="num">${{ico.market_cap | count}}</td>
                                    <td scope="row" class="num">${{ico.total_production_rate | count}}/s</td>
                                    <td scope="row" >{{ico.player_addr | addr}}</td>
                            </tr>
                            <tr v-if="show_scammers" v-for="(scammer, index) in scammers" v-bind:key="scammer.id">
                                <td scope="row" class="border-right" >{{index + 1}}</td>
                                
                                <td scope="row" class="num">{{scammer.nas_redeemed | nasComplete}}</td>
                                <td scope="row" >{{scammer.addr | addr}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="col-lg-1"></div>
    </div>
    </div>
</template>

<script>
import Navbar from './Navbar.vue';
let gen = require('random-seed');
let game = require("../logic/game.js");


  function randomInt (min, max, seed){
    return Math.floor(random(seed) * (max - min + 1)) + min;
  }


  export default {
    name: "CMC",
    props : ['status'],

    data () {
      return {
        show_scammers : false,
        scammers: [],
        icos: [],
      };
    },

    components :{
      Navbar
    },

    methods : {
      randomColor:function(seed){
        let rng = gen.create(seed);
        let h = rng.intBetween(0, 360);
        let s = rng.intBetween(42, 98);
        let l = rng.intBetween(40, 90);

        return `hsl(${h},${s}%,${l}%)`;
      },
        getBestKnownScammers()
        {
            game.getBestKnownScammers(null, null, (resp) =>
            { 
                this.scammers = resp;
            }, status.onError);
        },
        getCoinMarketCaps()
        {
            game.getCoinMarketCaps(null, null, (resp) =>
            {
                this.icos = resp;
            }, status.onError);
        },
    },
    mounted() {
        this.getCoinMarketCaps();
        this.getBestKnownScammers();
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

    .ticker{
        padding: 5px;
        border-radius:15px;
        border:2px solid transparent;
        color:black;
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
</style>