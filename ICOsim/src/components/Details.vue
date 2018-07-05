<template>
    <div class="row mb-4">
        <div class="col-12 details-container">
            <div class="row details-inner">
                <div class="col-12">
                    <div class="row text-center align-bottom" v-if="game.active_ico">
                        <div class="col-xl-4">
                            <span v-if="!isscam">
                                <div class="details-header">{{ $t("details.market_cap") }}</div>
                                <div>$<FundsContainer :mystyle="{fontSize:'2em', backgroundColor:'transparent'}" :target="playerResources" :start="playerResources"/></div>
                                <div><FundsContainer 
                                    :prefix="'+$'"
                                    :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" 
                                    :showdirection=1 :target="total_production_with_bonus" 
                                    :start="total_production_with_bonus" style="display:inline-block"
                                    :label="$t('units.per_s')" /></div>
                            </span>
                        </div>
                        <div class="col-xl-4 mb-3">
                            <div class="details-header">
                                <span  class="name">{{game.active_ico ? game.active_ico.name : ""}}
                                    </span>
                                </div>
                            <div class="tickericon">
                                <span v-if="game.active_ico" v-bind:style="{backgroundColor:game.active_ico.ticker_color, borderColor:game.active_ico.ticker_border_color}" class="ticker">{{game.active_ico.ticker}}</span>
                            </div>
                            <div class="notyours" v-if="game.active_ico && !isMyGame()">
                                {{ $t("details.not_your_ico") }}.
                                 <a style="color:white;" href="/">{{ $t("details.launch_your_own") }}</a>.</div>
                        </div>
                        <div class="col-xl-4">
                            <div class="details-header header-small">
                                {{ $t("details.exit_scam") }} 
                                <span class="details-header header-small" v-if="!isscam">
                                    {{ $t("details.value") }} <i style="cursor:pointer" @click="$refs.helpModal.show()" class="fas fa-question-circle"></i>
                                </span>
                                <span class="details-header header-small" v-else>
                                    {{ $t("details.amount_taken") }}
                                </span>
                            </div>
                            <FundsContainer 
                                v-if="nas_value() != null"  
                                :jumpprecision="0.0000000000000000001" 
                                :places=18 :mystyle="{fontSize:'2em', backgroundColor:'transparent'}" 
                                :showdirection=1 :target="nas_value()" 
                                :start="nas_value()" style="display:inline-block" :label="'nas'" :labelstyle="''"/>
                        <br><button v-if="canExit()" class="btn btn-sm btn-primary mt-2" @click="exitScam()">{{ $t("details.exit_scam_now") }}</button>
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
            <h3>{{ $t("details.about_exit.title") }}</h3>
            <div style="modalbody">
                <p>
                    {{ $t("details.about_exit.p1") }} 
                </p>
                <p>
                    {{ $t("details.about_exit.p2") }}
                </p>
                <p>
                    {{ $t("details.about_exit.good_luck") }}!
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

    props : ['game', 'isMyGame', 'status', 'totalplayerresources', 'ico', 'isscam'],

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
        nas_value()
        {
            if(!this.isscam)
            {
                let value = game.estimateSellPrice(this.ico, this.game.smart_contract_balance, this.totalplayerresources);
                return value;
            }
            else
            {
                return this.game.active_ico.exit_amount;
            }
        },
    },

    computed : {
      total_production_with_bonus(){
        if(this.game && this.game.active_ico)
          return this.game.active_ico.total_production_with_bonus;
        return new BigNumber(0);
      },
      playerResources() 
      {
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

    .fas
    {
        font-size: .6em;
        vertical-align:top;
    }
    .name 
    {
        font-size: 2em;
        font-weight: bolder;
    }
    .notyours
    {
        margin-top: 1.5em;
        font-size: .75em;
    }
    .tickericon
    {
        margin-top: 1em;
    }
</style>