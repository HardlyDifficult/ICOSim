<template>
    <div class="row mb-4">
        <div class="col-12 details-container">
            <div class="row details-inner">
                <div class="col-12">
                    <div class="row text-center details-header">
                        <div class="col-md-3">Market Cap</div>
                        <div class="col-md-3">{{game.active_ico ? game.active_ico.name : ""}}</div>
                        <div class="col-md-2 header-small">Growth Rate</div>
                        <div class="col-md-2 header-small">Advisor Bonus</div>
                        <div class="col-md-2 header-small">Potential Exit Scam Value</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row text-center">
                        <div class="col-md-3">
                            $<FundsContainer :mystyle="{fontSize:'2em', backgroundColor:'transparent'}" :showdirection=1 :target="playerResources" :start="playerResources"/>
                        </div>
                        <div class="col-md-3">
                            {{game.active_ico ? game.active_ico.ticker : ""}}
                        </div>
                        <div class="col-md-2">
                            $<FundsContainer :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :showdirection=1 :target="production_rate" :start="production_rate" style="display:inline-block"/>/ s
                        </div>
                        <div class="col-md-2">
                            <FundsContainer :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :target="advisor_bonus" :start="advisor_bonus" style="display:inline-block"/>%
                        </div>
                        <div class="col-md-2">
                            <FundsContainer :jumpprecision="0.0000000000001" :places=12 :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :showdirection=1 :target="nas_value" :start="nas_value" style="display:inline-block"/> NAS
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row text-center">
                        <div class="col-md-3"></div>
                        <div class="col-md-3">
                            <small v-if="isMyGame()">Your ICO!</small>
                            <small v-else>Not your ICO. <a style="color:white;" href="/">get to yours</a></small>
                        </div>
                        <div class="col-md-2"></div>
                        <div class="col-md-2"></div>
                        <div class="col-md-2"><button v-if="canExit()" class="btn btn-sm btn-primary">EXIT SCAM NOW</button></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import FundsContainer from './FundsDisplay';
  import {BigNumber} from 'bignumber.js';

  const token_denominator = new BigNumber(1000000000000000000);

  export default {
    name: "Details",

    props : ['game', 'isMyGame'],

    components : {
      FundsContainer
    },

    methods : {
      canExit(){
        return (this.game && this.game.active_ico && this.game.active_ico.my_resources_nas_value.gt(0));
      }
    },

    computed : {
      production_rate(){
        if(this.game && this.game.active_ico)
          return this.game.active_ico.my_production_rate;
        return new BigNumber(0);
      },
      advisor_bonus(){
        if(this.game && this.game.active_ico)
          return this.game.active_ico.my_bonus;
        return new BigNumber(0);
      },
      nas_value(){
        if(this.game && this.game.active_ico)
          return this.game.active_ico.my_resources_nas_value.div(token_denominator);
        return new BigNumber(0);
      },
      playerResources(){
        return (this.game && this.game.active_ico) ? this.game.active_ico.resources : new BigNumber(0);
      }
    }

  }
</script>

<style scoped>

    .title{
        font-size:1.5em;
    }
    .growth-container{

    }
    .details-header > *{
        font-size: 2em;

    }
    .header-small{
        font-size:1em;
    }
    .details-container{
        text-align:right;
        padding-left:45px;
        padding-right:45px;
    }
    .details-inner{
        padding-top:15px;
        padding-bottom:15px;
        background-color:green;
        border-radius:5px;
        background: linear-gradient(to top, rgba(17,203,255,0.0), rgba(17,203,255,0.3));
    }

</style>