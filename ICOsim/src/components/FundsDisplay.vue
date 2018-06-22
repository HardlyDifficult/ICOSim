<template>
    <div class="row">
        <div class="col">
            <div class="funds">
                <FundNumber :mystyle="mystyle" class="fas fa-dollar-sign dollar" content=""></FundNumber>
                <FundNumber v-for="(part, index) in fund_parts" :class="(part === '.' ? 'fund-dot' : '')" v-bind:key="index" :mystyle="mystyle" :content="part"/>
            </div>
        </div>
    </div>
</template>

<script>
    import {BigNumber} from 'bignumber.js';
    import FundNumber from './FundNumber';

    export default {
    name: "FundsDisplay",
    props : ['target', 'mystyle'],
    components : {
      FundNumber
    },

    data : function(){
      return {
        value : new BigNumber("0"),
        step: new BigNumber("0.0005")
      }
    },

    methods : {
      getDiff(a,b){
        return this.value.abs().minus(this.target.abs()).abs();
      },

      lerp(){
        if(this.target){
          this.step = this.target.minus(this.value).div(50);
          let diff = this.getDiff(this.value, this.target);

          if(diff.lt(0.1)){
            this.value = this.target;
          }else{
            this.value = this.value.plus(this.step);
          }

          setTimeout(()=>{
            this.lerp();
          }, 10);
        }
      }
    },

    computed : {
      fund_parts () {
        let parts = this.value.toFixed(2).toString().split(".");
        let parts2 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",").split(",");
        return [
            ...parts2,
            ".",
            parts[1]
        ];
      }
    },

    created(){
      this.lerp();
    }
  }
</script>

<style scoped>
    .funds {

    }
    .fund-dot{
        padding-left : 0;
        padding-right: 0;
    }
    .dollar{
        color : white !important;
        font-size: 3em !important;
    }
</style>