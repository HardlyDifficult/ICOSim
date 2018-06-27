<template>
  <span class="funds">
      <FundNumber v-for="(part, index) in fund_parts" :class="(part === '.' ? 'fund-dot' : '')" 
        v-bind:key="index" :mystyle="mystyle" :content="part"/>

      <i v-if="showdirection && step.gt(0)" class="fas fa-caret-up" 
        :style="mystyle ? mystyle : {fontSize : '4em'}" style="color:green !important;"></i>
      <i v-if="showdirection && step.lt(0)" class="fas fa-caret-down" 
        :style="mystyle ? mystyle : {fontSize : '4em'}" style="color:red !important;"></i>
  </span>
</template>

<script>
    import {BigNumber} from 'bignumber.js';
    import FundNumber from './FundNumber';

    export default {
    name: "FundsDisplay",
    props : ['target', 'mystyle', 'instant', 'showdirection', 'places'],
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

          if(this.instant !== undefined){
            if(diff.gt(0))
              this.value = this.target;

            setTimeout(()=>{
              this.lerp();
            }, 10);
          }else{
            if(diff.lt(0.1)){
              this.value = this.target;
              this.step = new BigNumber(0);
            }else{
              this.value = this.value.plus(this.step);
            }

            setTimeout(()=>{
              this.lerp();
            }, 10);
          }
        }
      }
    },

    computed : {
      fund_parts () {
        let parts = this.value.toFixed(this.places ? this.places : 2).toString().split(".");
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
        pointer-events:none;
    }
</style>