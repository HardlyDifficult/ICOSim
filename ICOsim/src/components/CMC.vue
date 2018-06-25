<template>
    <div class='container-fluid'>
    <div class="row">
        <div class="fixed-bg"></div><!--super stupid workaround-->
        <div class="col-12">
            <Navbar/>
            <div class="row">
                <div class="col-12 hl"></div>
                <div class="col-4">
                </div>
                <div class="col-4">
                    <h3 class="title" v-if="show_exits">Top successful exit scams</h3>
                    <h3 class="title" v-if="!show_exits">Top running ICOs</h3>
                </div>
                <div class="col-4"></div>
            </div>
        </div>
        <div class="col-12 table-container">
            <div class="row">
                <div class="col-lg-1"></div>
                <div class="col-lg-10">
                    <div class="table-header">
                        <div class="table-header-el" :class="show_exits ? '' : 'active'" @click="show_exits=false">
                            Active ICOs
                        </div>
                        <div class="table-header-el" :class="show_exits ?  'active' : ''" @click="show_exits=true">
                            Successful Exit Scams
                        </div>
                    </div>
                    <table class="table cmc-table">
                        <thead>
                            <tr>
                                <th scope="col" class="border-right">#</th>
                                <th scope="col">Ticker</th>
                                <th scope="col">Name</th>
                                <th scope="col" class="num" v-if="show_exits">Exit</th>
                                <th scope="col" class="num" v-if="!show_exits">Market Cap</th>
                                <th scope="col" class="num" v-if="!show_exits">Growth</th>
                                <th scope="col" >Owner</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(ico, index) in icos" v-bind:key="index">
                                <template v-if="(show_exits && ico.exit) || (!show_exits && !ico.exit)">
                                    <td scope="row" class="border-right" >{{index + 1}}</td>
                                    <td scope="row" ><span v-bind:style="{backgroundColor:randomColor(ico.coin), borderColor:randomColor(ico.coin + ico.ticker)}" class="ticker">{{ico.ticker}}</span></td>
                                    <td scope="row" >{{ico.coin}}</td>
                                    <td scope="row" class="num" v-if="show_exits">$ {{ico.exit.toString()}}</td>
                                    <td scope="row" class="num" v-if="!show_exits">$ {{ico.cap.toString()}}</td>
                                    <td scope="row" class="num" v-if="!show_exits">$ {{ico.growth_per_s.toString()}}</td>
                                    <td scope="row" >{{ico.user}}</td>
                                </template>
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
  import {BigNumber} from 'bignumber.js';
  let gen = require('random-seed');


  function randomInt (min, max, seed){
    return Math.floor(random(seed) * (max - min + 1)) + min;
  }


  export default {
    name: "CMC",
    data () {
      return {
        show_exits : false,
        icos : [
          {
            user : "n1Vk4pTWvwhKnk6rwGaCwgJdJo6zQf6yJfB",
            coin : "Bitconnect",
            ticker : "BCC",
            exit : new BigNumber(9999),
            cap : new BigNumber(7777),
            growth_per_s: new BigNumber(100),
          },
          {
            user : "n1Vk4pTWnwhKnk6rwGaCwgJdJo6zQf6yJfB",
            coin : "TestCoin3",
            ticker : "TC3",
            exit : new BigNumber(9999),
            cap : new BigNumber(7777),
            growth_per_s: new BigNumber(100),
          },
          {
            user : "n1Vk4pTWBwhKnk6rwGaCwgJdJo6zQf6yJfB",
            coin : "TestCoin",
            ticker : "TSTCOIN",
            exit : new BigNumber(9999),
            cap : new BigNumber(7777),
            growth_per_s: new BigNumber(100),
          },
          {
            user : "n1Vk4pTWBwhKnk6rwGaCwgJdJo6zQf6yJfB",
            coin : "TestCoin",
            ticker : "TSTCOIN",
            exit : null,
            cap : new BigNumber(7777),
            growth_per_s: new BigNumber(100),
          }


        ]
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

        let out = `hsl(${h},${s}%,${l}%)`;
        console.log(out);
        return out;
      }
    }

  }
</script>

<style scoped>

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
    .table-header{
        width:100%;
        background-color:red;
    }
    .table-header-el{
        float:left;
        width:20%;
        font-size:1.3em;
        box-sizing: border-box !important;
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