<template>
    <div class="row mb-4">
        <div class="col-12 details-container">
            <div class="row details-inner">
                <div class="col-12">
                    <div class="row text-center details-header align-bottom">
                        <div class="col-md-4">Market Cap</div>
                        <div class="col-md-4">{{game.active_ico ? game.active_ico.name : ""}}</div>
                        <div class="col-md-4 header-small align-bottom mt-3">Exit Scam Value <i style="cursor:pointer" @click="$refs.helpModal.show()" class="fas fa-question-circle"></i></div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row text-center">
                        <div class="col-md-4">
                            $<FundsContainer :mystyle="{fontSize:'2em', backgroundColor:'transparent'}" :target="playerResources" :start="playerResources"/>
                            <br>+ $<FundsContainer :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :showdirection=1 :target="total_production_with_bonus" :start="total_production_with_bonus" style="display:inline-block"/>/ s
                        </div>
                        <div class="col-md-4">
                            {{game.active_ico ? game.active_ico.ticker : ""}}
                            <br><small v-if="!isMyGame()">Not your ICO. <a style="color:white;" href="/">get to yours</a></small>
                        </div>
                        <div class="col-md-4">
                            <FundsContainer :jumpprecision="0.0000000000000000001" :places=18 :mystyle="{fontSize:'2em', backgroundColor:'transparent'}" :showdirection=1 :target="nas_value" :start="nas_value" style="display:inline-block" :label="'nas'" :labelstyle="''"/>
                        <br><button v-if="canExit()" class="btn btn-sm btn-primary" @click="exitScam()">EXIT SCAM NOW</button>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="row text-center">
                        <div class="col-md-4"></div>
                        <div class="col-md-4">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Modal ref="helpModal">
            <h3>What's an Exit Scam?</h3>
            <div style="max-width:40em">
            <p>
                100% of NAS spent is redistributed to players who "Exit Scam".  
                The value you may claim is determined by the ICOs market cap. 
                So hype your ICO before you dump your bags.  
            </p>
            <p>
                The amount you can get when exit scamming may go down when others play.
                Once you "Exit Scam" you may start over by launching a new ICO.
            </p>
            <p>
                Good Luck!
            </p>
            </div>
        </Modal>
    </div>
</template>

<script>
  import FundsContainer from './FundsDisplay';
  import {BigNumber} from 'bignumber.js';
  import Modal from './Modal';
    const game = require("../logic/game.js");


  export default {
    name: "Details",

    props : ['game', 'isMyGame', 'status'],

    components : {
      FundsContainer,
      Modal
    },
    data() { return {
    }},

    methods : {
      canExit(){
        return (this.game && this.game.active_ico && this.game.active_ico.my_resources_nas_value.gt(0));
      },
        exitScam()
        {
            game.exitScam(status.onTxPosted, status.onSuccess, status.onError);
        },
    },

    computed : {
      total_production_with_bonus(){
        if(this.game && this.game.active_ico)
          return this.game.active_ico.total_production_with_bonus;
        return new BigNumber(0);
      },
      nas_value(){
        if(this.game && this.game.active_ico)
          return this.game.sell_price_nas_per_resource.mul(this.game.active_ico.estimated_resources);
        return new BigNumber(0);
      },
      playerResources() 
      {
        return (this.game && this.game.active_ico) ? this.game.active_ico.estimated_resources : new BigNumber(0);
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

    .fas
    {
        font-size: .6em;
        vertical-align:top;
    }
</style>