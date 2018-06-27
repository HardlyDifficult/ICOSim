<template>
    <div class="row mb-4">
        <div class="col-12 details-container">
            <div class="row details-inner">
                <div class="col-12">
                    <div class="row text-center details-header">
                        <div class="col-md-4">Market Cap</div>
                        <div class="col-md-4">{{game.active_ico ? game.active_ico.name : ""}}</div>
                        <div class="col-md-2 header-small">Growth Rate</div>
                        <div class="col-md-2 header-small">Potential Exit Scam Value</div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row text-center">
                        <div class="col-md-4">
                            $<FundsContainer :mystyle="{fontSize:'2em', backgroundColor:'transparent'}" :showdirection=1 :target="playerResources"/>
                        </div>
                        <div class="col-md-4">{{game.active_ico ? game.active_ico.ticker : ""}}</div>
                        <div class="col-md-2">
                            $<FundsContainer :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :target="production_rate" style="display:inline-block"/>/ s
                        </div>
                        <div class="col-md-2">
                            <FundsContainer :places=8 :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :target="nas_value" style="display:inline-block"/> NAS
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import FundsContainer from './FundsDisplay';
  import {BigNumber} from 'bignumber.js';

  export default {
    name: "Details",

    props : ['game'],

    components : {
      FundsContainer
    },

    computed : {
      production_rate(){
        if(this.game && this.game.active_ico)
          return new BigNumber(this.game.active_ico.my_production_rate);
        return new BigNumber(0);
      },
      nas_value(){
        if(this.game && this.game.active_ico)
          return new BigNumber(this.game.active_ico.my_resources_nas_value);
        return new BigNumber(0);
      },
      playerResources(){
        return (this.game && this.game.active_ico) ? new BigNumber(this.game.active_ico.resources) : new BigNumber(0);
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