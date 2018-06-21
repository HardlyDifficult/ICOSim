<template>
    <div class="row">
        <div class="col">
            <div class="funds">
                <span class="fund_part"><i class="fas fa-dollar-sign"></i></span>
                <span class="fund_part" v-for="(part, index) in fund_parts" :class="(part === '.' ? 'fund-dot' : '')" v-bind:key="index">{{part}}</span>
            </div>
        </div>
    </div>
</template>

<script>
    import {BigNumber} from 'bignumber.js';

    export default {
    name: "FundsDisplay",
    props : ['amount'],

    data : function(){
      return {
        value : new BigNumber("0.123"),
        target : new BigNumber("1000000.33"),
        step: new BigNumber("0.0005")
      }
    },

    methods : {
      getDiff(a,b){
        return this.value.abs().minus(this.target.abs()).abs();
      },

      lerp(){
        this.step = this.target.minus(this.value).div(50);
        let diff = this.getDiff(this.value, this.target);

        if(diff.lt(0.1)){
          this.value = this.target;
          this.target = new BigNumber(Math.random()*100000000);
        }else{
          this.value = this.value.plus(this.step);
        }

        setTimeout(()=>{
          this.lerp();
        }, 10);
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
    .fund_part{
        font-family: monospace;
        background-color: rgba(30,30,30,0.7);
        color : rgba(15,77,175,1);
        padding:10px;
        border-radius:15px;
        margin:0;
        font-size:4em;
    }
    .fund-dot{
        padding-left : 0;
        padding-right: 0;
    }
    .dollar{
        color : #0f4daf;
    }
</style>