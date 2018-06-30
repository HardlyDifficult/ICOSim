<template>
    <div class="airdrop-outer">
        <div class="airdrop-warning" v-if="!game.current_event || game.current_event.number_of_blocks_remaining === 0 || game.current_event.user_has_redeemed">
            <span v-if="game.current_event && game.current_event.user_has_redeemed">
                Successfully claimed Airdrop!<br>
                <!--$<FundsDisplay :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :target="game.current_event.expected_reward" :start="game.current_event.expected_reward" style="display:inline-block"/>-->
            </span>
            <span v-else>
                <i class="fas fa-exclamation exclamation"></i>
                Airdrop in: {{ game.blocks_till_next_event | count }} blocks (~{{ game.blocks_till_next_event | blocks_to_seconds}}s)
                <i class="fas fa-exclamation exclamation"></i>
            </span>
        </div>
        <div v-else class="airdrop-container">
            <div class="airdrop-information clickable glow-airdrop" @click="redeemEvent()">
                <div class="col-12">
                    Claim Airdrop worth<br>
                    $<FundsDisplay showdirection=1 :mystyle="rewardNumberStyle" :target="getExpectedReward()"/>
                </div>
                <div class="col-12">
                    Blocks Remaining: {{ game.current_event ? game.current_event.number_of_blocks_remaining : 0 | count }}
                    (~{{(game.current_event ? game.current_event.number_of_blocks_remaining : 0) | blocks_to_seconds}} seconds)
                </div>
            </div>
        </div>
    </div>

    <!--
    <div class="row airdrops-container">
        <h1>
            Airdrop
        </h1>
        <div class="col">
            <div class="col" v-if="!game.current_event || game.current_event.number_of_blocks_remaining == 0 || game.current_event.user_has_redeemed">
                Next Event starts in: {{ game.blocks_till_next_event | count }} blocks
            </div>
            <span v-else>
                <div class="col-12">
                    Expected Reward: {{ game.current_event.expected_reward | count }}
                </div>
                <div class="col-12">
                    Blocks Remaining: {{ game.current_event.number_of_blocks_remaining | count }}
                </div>
                <div class="col-12" v-if="isMyGame()">
                    <button @click="redeemEvent()" class="btn btn-primary">Redeem</button>
                </div>
            </span>
        </div>
    </div>
    -->
</template>

<script>
  import FundsDisplay from './FundsDisplay';
  import {BigNumber} from 'bignumber.js';
    const game = require("../logic/game.js");

  export default {
    name: "Airdrops",

    props : ['game', 'isMyGame', 'status'],

    data(){
      return {
        rewardNumberStyle : {
          fontSize:'16px',
          backgroundColor:'transparent'
        }
      }
    },

    components : {
      FundsDisplay
    },

    methods : {
      getExpectedReward(){
        return this.game.current_event ? this.game.current_event.expected_reward : new BigNumber(0);
      },
    redeemEvent()
    {
        game.redeemEvent(this.status.onTxPosted, (resp) => {
            this.game.current_event.user_has_redeemed = true;
            this.status.onSuccess(resp);
        }, this.status.onError);
    },
    },
  }

</script>

<style scoped>
    .airdrop-outer{
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        pointer-events: none;
        overflow:hidden;
    }
    .airdrop-outer *{
        pointer-events:all;
        z-index: 2;
    }
    .airdrop-warning{
        position:fixed;
        top:0;
        left : calc(50% - 175px);
        width:350px;
        padding-top:20px;
        padding-bottom:20px;
        background-color: rgba(0,0,0,0.7);
    }

    .exclamation{
        color:orange;
        font-size:1.5em;
    }

    @keyframes airdrop-animation{
        from {
            transform: rotate(30deg);
            transform-origin: top center;
        }
        to {
            transform: rotate(-30deg);
            transform-origin: top center;
        }
    }
    @keyframes airdrop-movement-animation{
        from {
            left:20%;
        }
        to {
            left:80%;
        }

    }
    @keyframes airdrop-movement-vertical-animation{
        from {
            top:0;
        }
        to {
            top:300px;
        }

    }
    .airdrop-container{
        animation: airdrop-animation 4s infinite, airdrop-movement-animation 30s infinite, airdrop-movement-vertical-animation 7s infinite;
        animation-direction: alternate;
        animation-timing-function: ease-in-out;

        z-index: 100;
        position:absolute;
        top:0;
        height:350px;
        width:200px;
        background-image: url(../assets/chute.png);
        background-size:contain;
        background-position:center top;
        background-repeat:no-repeat;
    }
    .airdrop-information{
        position:absolute;
        bottom:0;
        left:0;
        height:100px;
        width:100%;
        background-color: rgba(0,0,0,0.9);
    }
    .airdrop-information:hover{
        background-color: rgba(0,0,0,1);
    }
    .clickable{
        cursor: pointer;
    }
    .unclickable{
        pointer-events: none;
    }
    .glow-airdrop{
        -webkit-box-shadow: 0px 0px 10px rgba(46,255,255,0.22);
        -moz-box-shadow: 0px 0px 10px 1px rgba(46,255,255,0.22);
        box-shadow: 0px 0px 10px 1px rgba(46,255,255,0.22);
    }
</style>