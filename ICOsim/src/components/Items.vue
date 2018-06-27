<template>
    <div class="row roadmap-container">
        <div class="col-sm-12">
            <h2>{{ page_title }}</h2>
        </div>
        <template v-for="(item, index) in items">
            <div class="col-6 roadmap-step" :key="index" :class="getStepClasses(item, index)">
                <div class="row roadmap-step-inner" :class="(item.next_price > player_money) ? 'glow-cant-afford' : 'glow-1'">
                        <div class="col-12">
                            <div class="row">
                                <div class="col-12" v-if="isTeam">
                                    <div class="image" :style="{backgroundImage:'url(' + pictures[item.name]+ ')'}"></div>
                                </div>
                                <div class="col-12">
                                    <p class="title">{{item.name}}</p>
                                    <!-- <p class="member-description">{{member.description}}</p>
                                    
                                    <p v-if="parseInt(member.user_holdings) > 0" class="member-buy">ADVISOR LEVEL {{member.user_holdings}}</p>
                                    <p v-else class="member-buy">BUY TO UNLOCK ADVISOR</p> -->
                                </div>
                            </div>
                        </div>

                        <div class="col-12 line"></div>

                        <div class="col-4">
                            <p>Count: {{item.user_holdings}}</p>
                            <p>Production: {{item.user_item_production.toString()}}</p>
                        </div>
                        <div class="col-8">
                            <p>
                                Current Price
                            </p>
                            $<FundsContainer instant style="display:inline-block" :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :target="item.user_price"/>
                        </div>

                        <div class="col-12 line"></div>

                        <div class="col-12">
                            <div class="row cols-same-height">
                                <div class="col-4">
                                    <button @click="onBuy(item, selections[item.name].number_to_buy.toString())" class="btn btn-buy">BUY</button>
                                </div>
                                <div class="col-md-8">
                                    <div class="row">
                                        <div class="col-12">
                                            BUY {{selections[item.name].number_to_buy}} FOR $ {{getBuyPrice(item)}}
                                        </div>
                                        <div class="col-12">
                                            <VueSlider
                                                    ref="slider"
                                                    v-model="selections[item.name].number_to_buy"
                                                    :speed="0"
                                                    :min="item.user_max_can_afford > 0 ? 1 : 0"
                                                    :max="item.user_max_can_afford"
                                            ></VueSlider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row mt-5">
                                <div class="col-12" v-if="isMyGame()">
                                    <input type="number" v-model="selections[item.name].number_to_buy_with_nas" @input="$forceUpdate()">
                                    <button v-on:click="buyWithNas(item, selections[item.name].number_to_buy_with_nas)" class="btn btn-secondary">
                                        Buy for {{ getBuyWithNasCost(item) | nas }}
                                    </button>
                                    Buy {{ selections[item.name].number_to_buy_with_nas | count }} for +{{ getBuyProductionGainWithNas(item) | count }}/s 
                                </div>
                            </div>
                        </div>
                </div>
                <div v-if="!isTeam" class="connecting-line" v-anime="line_animation"></div>
            </div>
        </template>
        <div v-if="!isTeam" class="middle-line"></div>
    </div>
</template>

<script>
  const game = require("../logic/game.js");
  import FundsContainer from './FundsDisplay';
  import VueSlider from 'vue-slider-component';

  export default {
    name: "Items",

    props : ['items', 'selections', 'isMyGame', 'isTeam', 'status'],

    components : {
      FundsContainer,
      VueSlider
    },

    methods : {
      getStepClasses(item, index){
        let classes = [];
        if(!this.isTeam)
            classes.push(this.classes[index % 4]);


        if(parseInt(item.user_holdings) <= 0){
          classes.push('locked');
        }else{
          classes.push('unlocked');
        }

        if(item.user_max_can_afford > 0){
          classes.push('can_afford');
        }else{
          classes.push('cannot_afford');
        }

        return classes;
      },
      onBuy(item, count)
    {
      game.buy(item, count, status.onTxPosted, status.onSuccess, status.onError);
    },
    buyWithNas(item, count)
    {
      game.buyWithNas(item, count, status.onTxPosted, status.onSuccess, status.onError);
    },
        getBuyPrice(item)
        {
            return game.getBuyPrice(item, this.selections[item.name].number_to_buy);
        },
        getBuyWithNasCost(item)
        {
            return game.getBuyWithNasCost(item, this.selections[item.name].number_to_buy_with_nas);
        },
        getBuyProductionGain(item)
        {
            return this.selections[item.name].number_to_buy * item.resources_per_s;
        },
        getBuyProductionGainWithNas(item)
        {
            return this.selections[item.name].number_to_buy_with_nas * item.resources_per_s;
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
      return formatCoins(value, 4);
    },
  },

    data (){
      return {
        value : 5,
        line_animation: {

        } ,
        classes : [
          "step-1",
          "step-2",
          "step-3",
          "step-4"
        ],
        player_money : 75,
        amount_to_invest: 0,
        page_title: this.isTeam == true ? "Team" : "Roadmap",
        pictures : {
          'Roger Ver' : require('../assets/ver.png'),
          'John McAfee' : require('../assets/mcafee.png'),
          'Carlos Matos': require('../assets/matos.png'),
          'Tom Lee' : require('../assets/lee.png'),
          'Craig Grant': require('../assets/grant.png'),
          'Ian Balina': require('../assets/balina.png'),
          'Suppoman': require('../assets/suppoman.png'),
          'Trevon James': require('../assets/trevon.png'),
        },
      };
    },
    mounted()
    {
    }

  }

  
// From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x, decimals) => 
{
    if(decimals == null)
    {
        decimals = 0;
    }
    let parts = new BigNumber(x).toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}

const token_denominator = new BigNumber(1000000000000000000);

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
    let x = new BigNumber(number).div(token_denominator);
    return numberWithCommas(x, digits) + " " + unit;
}
</script>

<style scoped>

    .roadmap-step-inner{
        background-color:rgba(0,0,0,0.6);

        border-radius : 5px 5px 5px 5px;
        padding:15px;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        margin-left:15px;
        margin-right:15px;
    }

    .title{
        color: white;
        font-size: 1.5em;
        text-align:center;
        width:100%;
    }

    .connecting-line{
        position:absolute;
        background-color:#003430;
        z-index: 1;
    }

    .middle-line{
        position:absolute;
        left:50%;
        top:100px;
        height:100%;
        width:5px;
        background-color:#003430;
        z-index: 1;
    }
    .roadmap-container{
        position: relative;
    }

    .can_afford > .roadmap-step-inner{
    }

    .roadmap-step{
        margin-bottom:65px;
        margin-top:15px;
        position:relative;
    }

    .locked.cannot_afford > .roadmap-step-inner{
        opacity: 0.1;
        pointer-events: none;
    }

    .locked.can_afford> .roadmap-step-inner{
        opacity: 0.5;
    }
    .locked.can_afford> .roadmap-step-inner:hover {
        opacity: 0.9;
    }

    .step-2, .step-4{
        top: 100px;
    }

    .step-1 > .connecting-line, .step-3 > .connecting-line{
        top : calc(50% - 5px);
        right:0;
        height:5px;
        width:30px;
    }
    .step-2 > .connecting-line, .step-4 > .connecting-line {
        top : calc(50% - 5px);
        right:calc(100% - 30px);
        height:5px;
        width:30px;
    }

    .btn-buy{
        width:100%;
        height:100%;
    }

    .cannot_afford .btn-buy{
        background-color:rgba(125,125,125,0.5);
        cursor: default;
    }
    .can_afford .btn-buy{
        background-color:rgba(0,147,196,0.5);
        cursor:pointer;
    }
    .can_afford .btn-buy:hover{
        background-color:rgba(0,177,193,0.5);
        cursor:pointer;
    }

    .btn:focus,.btn:active {
        outline: none !important;
        box-shadow: none;
    }

    .cols-same-height > [class*='col-'] {
        display: flex;
        flex-direction: column;
    }

    .line{
        height:2px;
        background-color: rgba(0,147,196,0.5);
        margin-top:5px;
        margin-bottom:10px;
    }

    p{
        margin-top:0.5px;
        margin-bottom:0.5px;
    }

    .member-name{
        font-size:1.5em;
        padding:0;
    }
    .member-description{
        font-size:0.9em;
        padding:0;
    }
    .image{
        margin: 0 auto;
        margin-bottom:10px;
        height:150px;
        width:150px;
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
        border-radius: 250px;
        -webkit-filter: sepia(50%);
        filter: sepia(50%);
    }
</style>