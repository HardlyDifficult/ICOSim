<template>
    <div class="row">
        <div class="col-sm-6"></div>
        <div class="col-lg-6">
            <div class="row">
                <div class="col-lg-12 title">
                    GrowthRate
                </div>
                <div class="col-lg-12 growth-container">
                    <FundsContainer :mystyle="{fontSize:'2em'}" :target="production_rate" style="display:inline-block"/> per second
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
    .details-container{
        text-align:right;
    }

</style>