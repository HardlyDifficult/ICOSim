<template>
    <div class="row roadmap-container">
        <div class="col-sm-12">
            <h2>{{ page_title }}</h2>
            <h5 v-if="game.active_ico">
                <span v-if="!isTeam && game.active_ico.total_production_rate != null">
                    Production: 
                    <FundsContainer
                        :prefix="'$'"
                        :label="'/s'"
                        instant 
                        style="display:inline-block" 
                        :mystyle="{fontSize:'1.25em', color:'white', backgroundColor:'transparent'}" 
                        :target="game.active_ico.total_production_rate" 
                        :places=2
                        :showdirection=0 /> 
                </span>
                <span v-if="isTeam && game.active_ico.total_bonus != null">
                    Bonus:
                    <FundsContainer
                        :label="'%'"
                        instant 
                        style="display:inline-block" 
                        :mystyle="{fontSize:'1.25em', color:'white', backgroundColor:'transparent'}" 
                        :target="game.active_ico.total_bonus.mul(100)" 
                        :places=0
                        :showdirection=0 /> 
                </span>
            </h5>
        </div>
        <template v-for="(item, index) in items">
            <div class="col-6 roadmap-step" :key="index" :class="getStepClasses(item, index)">
                <div class="row roadmap-step-inner" :class="(item.next_price > player_money) ? 'glow-cant-afford' : 'glow-1'">
                    <div class="corner-ribbon-container"><div class="corner-ribbon"></div></div>
                        <div class="col-12">
                            <div class="row">
                                <div class="col-12" v-if="isTeam">
                                    <div class="row cols-same-height mt-1">
                                        <div class="col-xl-6 col-lg-12 member-description-outer">
                                            <p class="member-description">{{team[item.name].desc}}</p>
                                        </div>
                                        <div class="col-xl-6 col-lg-12">
                                            <div class="image" :style="{backgroundImage:'url(' + team[item.name].img+ ')'}"></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12">
                                    <p class="title">{{item.name}}</p>
                                    <template v-if="isTeam">
                                        <span v-if="game.active_ico">
                                        <p v-if="parseInt(item.user_holdings) > 0" class="member-buy">
                                            <span v-if="team[item.name].quote">
                                                "{{quote(team[item.name].quote)}}"
                                            </span>
                                            <span v-else>
                                                ADVISOR LEVEL {{item.user_holdings}}
                                            </span>
                                        </p>
                                        <p v-else class="member-buy">BUY TO UNLOCK ADVISOR</p>
                                        </span>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 line gray-on-disable"></div>


                        <div class="col-12 gray-on-disable">
                            <p>Price</p>
                            $<FundsContainer instant style="display:inline-block" :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :target="item.user_price ? item.user_price : item.start_price"/>
                            <span v-if="item.resources_per_s">
                                <p class="mt-1">Production</p>
                                <span class="mono">${{item.resources_per_s | resources}}/s</span>
                            </span>
                            <span v-else>
                                <p class="mt-1">Bonus</p>
                                <span class="mono">{{item.bonus_multiplier | percent}}</span>
                            </span>
                        </div>

                        <div v-if="game.active_ico" class="col-12 line gray-on-disable"></div>
                        <div v-if="game.active_ico" class="col-12">
                            <div class="row">
                                <div class="col text-center">
                                    <span v-if="isTeam">Level</span><span v-else>You have</span>: 
                                    <FundsContainer instant style="display:inline-block" :mystyle="{fontSize:'1.25em', color:'white', backgroundColor:'transparent'}" 
                                        :target="item.user_holdings" :places="'0'" :showdirection=0 />                                    
                                </div>
                            </div>
                            <div class="row">
                                <div class="col text-center" style="'white-space:nowrap'">
                                    <span v-if="item.user_item_production"> 
                                        <FundsContainer
                                            :prefix="'$'"
                                            :label="'/s'"
                                            instant 
                                            style="display:inline-block" 
                                            :mystyle="{fontSize:'1.25em', color:'white', backgroundColor:'transparent'}" 
                                            :target="item.user_item_production" 
                                            :places=2
                                            :showdirection=0 /> 

                                    </span>
                                    <span v-else>
                                        <FundsContainer
                                            :label="'%'"
                                            instant 
                                            style="display:inline-block" 
                                            :mystyle="{fontSize:'1.25em', color:'white', backgroundColor:'transparent'}" 
                                            :target="item.user_item_bonus" 
                                            :places=0
                                            :showdirection=0 />
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="col-12" v-if="isMyGame()">
                            <div class="row line gray-on-disable"></div>
                            <div class="row cols-same-height buy-section">
                                <div class="col-sm-12 gray-on-disable">
                                    <div class="row">
                                        <div class="col-12">
                                            <div class="row">
                                                <div class="col">
                                                    Buy <span class="mono">{{selections[item.name].number_to_buy | count}}</span>
                                                        <br>
                                                    <span class="mono">+${{ getBuyProductionGain(item) | resources }}/s</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <VueSlider
                                                    ref="slider"
                                                    v-model="selections[item.name].number_to_buy"
                                                    :speed="0"
                                                    :tooltip="'hover'"
                                                    :min="item.user_max_can_afford.gt(0) ? 1 : 0"
                                                    :max="item.user_max_can_afford.toNumber()"
                                            ></VueSlider>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-sm-12">
                                    <button @click="onBuy(item, selections[item.name].number_to_buy.toString())" class="btn btn-buy">
                                        BUY for <span class="mono">${{getBuyPrice(item) | resourcesApprox}}</span>
                                        </button>
                                </div>
                            </div>
                            <div class="row buy-with-nas-container" v-if="isMyGame()">
                                <div class="col-12 line gray-on-disable mt-2"></div>
                                <div class="col-12">
                                    <button class="btn btn-secondary col-12 btn-buy-w-nas" style="cursor:pointer" @click="show_buy_nas[item.name] = !show_buy_nas[item.name]">
                                        Buy for {{ item.nas_price | nasApprox }}
                                    </button>
                                </div>
                                <div class="col-12 mt-3" v-if="show_buy_nas[item.name]">
                                    <div class="row cols-same-height">
                                        <div class="col-12">
                                            <div class="row text-bottom">
                                                <div class="col-2 mt-2">
                                                    Buy:
                                                </div>
                                                <div class="col-10">
                                                    <input title="nas-buy-input" class="form-control" type="number" min="1" onkeypress="return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57" 
                                                        v-model="selections[item.name].number_to_buy_with_nas" @input="$forceUpdate()">
                                                </div>
                                                <div class="col-12 mt-2 mono">
                                                    +${{ getBuyProductionGainWithNas(item) | resources }}/s
                                                    <br>
                                                    {{ getBuyWithNasCost(item) | nas }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row mt-2 justify-content-center">
                                        <div class="col-12">
                                            <button style="font-size:0.8em" v-on:click="buyWithNas(item, selections[item.name].number_to_buy_with_nas)" class="btn btn-buy">
                                                BUY <br>w/ NAS
                                            </button>
                                        </div>
                                    <p class="mt-1" style="color:orange"><small>100% of NAS goes back to players</small></p>
                                    </div>
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

    props : ['items', 'selections', 'isMyGame', 'isTeam', 'status', 'game'],

    components : {
      FundsContainer,
      VueSlider
    },

    methods : {
      getStepClasses(item, index){
        let classes = [];
        if(!this.isTeam){
          classes.push(this.classes[index % 4]);
        }else{
          classes.push('roadmap-step-team');
        }


        if(parseInt(item.user_holdings) <= 0){
          classes.push('locked');
        }else{
          classes.push('unlocked');
        }

        if(item.user_max_can_afford > 0)
        {
          classes.push('can_afford');
        }
        else if(this.game.active_ico) 
        {
          classes.push('cannot_afford');
        }
        else
        {
            classes.push('newuser')
        }

        return classes;
      },
      onBuy(item, count)
    {
      game.buy(item, count, this.status.onTxPosted, this.status.onSuccess, this.status.onError);
    },
    buyWithNas(item, count)
    {
      game.buyWithNas(item, count, this.status.onTxPosted, this.status.onSuccess, this.status.onError);
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
            return game.getBuyProductionGain(this.game, item, this.selections[item.name].number_to_buy);
        },
        getBuyProductionGainWithNas(item)
        {
            return game.getBuyProductionGain(this.game, item, this.selections[item.name].number_to_buy_with_nas);
        },
        quote(value)
        {
            return value.replace("TICKER", this.game.active_ico.ticker);
        }
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
        page_title: this.isTeam == true ? "Advisors" : "Roadmap",
        team : {
          'Roger Ver' : {
            img:require('../assets/ver.png'),
            desc : 'The most passionate in the business',
            quote: 'TICKER is the real Bitcoin'
          } ,
          'John McAfee' : {
            img:require('../assets/mcafee.png'),
            desc : 'Each tweet averages $3 million in revenue',
            quote: 'No. Not joking. TICKER is a legitimate privacy coin and it\'s also selling for less than three cents.'
          },
          'Carlos Matos': {
            img:require('../assets/matos.png'),
            desc : 'The best Hype Man crypto has ever seen',
            quote: 'Wassa Wassa Wassa Wassa Up TICKER'
          },
          'Tom Lee' : {
            img:require('../assets/lee.png'),
            desc : 'The Permabull',
            quote: 'TICKER to $25k by 2019'
          },
          'Craig Grant': {
            img:require('../assets/grant.png'),
            desc : 'I started with $100 six months ago',
            quote : 'Look at the TICKER I earned, and didn\'t buy',
          },
          'Ian Balina': {
            img:require('../assets/balina.png'),
            desc : '\'Hacking the System\' and only hacked once',
            quote: 'ICO Grade for TICKER is 99%'
          },
          'Suppoman': {
            img:require('../assets/suppoman.png'),
            desc : 'Your superhero of cryptocurrency',
            quote: 'TICKER is one of the TOP 5 BEST ICOs of the year'
          },
          'Trevon James': {
            img:require('../assets/trevon.png'),
            desc : 'Don\'t talk to me unless it\'s about intangible coins',
            quote: 'This is day 30 of TICKER, I\'ve earned 30 Bitcoin so far',
          },
          'Dr Craig S Wright': {
            img:require('../assets/dr_fakesatoshi.png'),
            desc : 'Imagine that, having Satoshi as your advisor!',
            quote: 'I am going full billionaire mode on TICKER'
          },
        },
        show_buy_nas : {

        }
      };
    },
    mounted()
    {
      let newShowBuyNas = {}
      for(let i in this.items){
        newShowBuyNas[this.items[i].name] = false;
      }
      this.show_buy_nas = newShowBuyNas;
    },
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
        position:relative;
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
        height:calc(100% - 100px);
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
    .roadmap-step-team{
        margin-bottom:15px;
    }

    .locked.cannot_afford  .roadmap-step-inner{
        opacity: 0.1;
        -webkit-box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
        -moz-box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
        box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
    }
    .locked.cannot_afford  .btn{
        pointer-events: none;
    }

    .locked.cannot_afford .gray-on-disable{
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
    }

    .cannot_afford .buy-section{
        -webkit-filter: grayscale(100%);
        filter: grayscale(100%);
        opacity: 0.2;
        pointer-events: none;
    }

    .locked.can_afford> .roadmap-step-inner{
        opacity: 0.5;
    }
    .locked.can_afford> .roadmap-step-inner:hover {
        opacity: 0.9;
    }
    .locked.cannot_afford > .roadmap-step-inner:hover {
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
    .member-description-outer{
        min-height:4em;
        display: table;
    }
    .member-description{
        width:calc(100% + 1em);

        font-size:0.9em;
        padding:0;

        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: table-row;
    }

    .image{
        margin: 0 auto;
        margin-bottom:10px;
        height:150px;
        width:150px;
        max-width: 100%;
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
        border-radius: 250px;
        -webkit-filter: sepia(50%);
        filter: sepia(50%);
    }

    .corner-ribbon-container{
        position:absolute;
        left:-1px;
        top:-1px;
        height:100%;
        width:100%;
        overflow:hidden;
    }
    .corner-ribbon{
        visibility:hidden;
        width: 200px;
        background:green;
        position: absolute;
        top: 20px;
        left: -65px;
        text-align: center;
        line-height: 25px;
        letter-spacing: 1px;
        transform: rotate(-45deg);
        -webkit-transform: rotate(-45deg);
        font-size:0.7em;
        z-index:2;
        color:black;
        font-weight:bolder;
        opacity:0.7;
    }
    .unlocked .corner-ribbon{
        visibility:visible;
    }
    .unlocked.can_afford .corner-ribbon:before{
        content: "UPGRADE";
    }
    
    .newuser .corner-ribbon{
        visibility:visible;
        background:#288232;
    }
    .newuser .corner-ribbon:before{
        content: "BUY NOW";
    }

    .unlocked.cannot_afford .corner-ribbon{
        visibility:visible;
        background:#288232;
    }
    .unlocked.cannot_afford .corner-ribbon:before{
        content: "BOUGHT";
    }
    .locked.cannot_afford .corner-ribbon:before{
        content:"CANT AFFORD";
    }
    .locked.cannot_afford .corner-ribbon{
        visibility:visible;
        background:white;
    }
    .locked.can_afford .corner-ribbon:before{
        content:"BUY NOW";
    }
    .locked.can_afford .corner-ribbon{
        visibility:visible;
        background:orange;
    }
    .buy-with-nas-container *{
        pointer-events: all !important;
    }
    .buy-with-nas-container .btn{
        cursor:pointer;
    }
    .buy-with-nas-container .btn-buy{
        background-color:rgba(0,147,196,0.5);
    }
    .buy-with-nas-container .btn-buy:hover{
        background-color:rgba(0,177,193,0.5);
    }
    .buy-section-inner{

    }
    .btn{
        font-size: 1vw;
    }

    @media only screen and (max-width: 1199px) {
        .btn{
            font-size: 1.5vw;
        }
    }
    @media only screen and (min-width: 1920px) {
        .btn{
            font-size: 1em;
        }
    }

</style>
