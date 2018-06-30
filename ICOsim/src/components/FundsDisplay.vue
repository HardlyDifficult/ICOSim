<template>
  <span class="funds">
    <span v-if="prefix" :style="labelstyle">{{this.prefix}}</span><span
     v-for="(part, index) in number_parts" v-bind:key="'a' + index"><span 
     :class="index==0?'first':''" class="fund_part num" :style="mystyle">{{part}}</span>
      <span :style="mystyle" class="fund_part comma" v-if="index < number_parts.length - 1">,</span>
    </span>
    <span :style="mystyle" class="fund_part fund-dot" v-if="decimal_parts && decimal_parts.length > 0">.</span>
     <span v-for="(part, index) in decimal_parts" v-bind:key="'b' + index">
      <span :style="mystyle" class="fund_part num">{{part}}</span>
    </span>
    <span v-if="label" :style="labelstyle">{{this.label}}</span>
      
      <span :style="mystyle">
      <i v-if="showdirection && step.gt(0)" class="fas fa-caret-up"
        :style="green_style"></i>
      <i v-else-if="showdirection && step.lt(0)" class="fas fa-caret-down"
        :style="red_style"></i>
      <i v-else-if="showdirection" class="fas fa-caret-right"
         :style="{fontSize : '1em', color:'transparent'}" ></i>
    </span>
  </span>
</template>

<script>
    import {BigNumber} from 'bignumber.js';
    let first = true;
    
    export default {
    name: "FundsDisplay",
    props : ['target', 'mystyle', 'instant', 'showdirection', 'places', 'start', 'jumpprecision', 'label', 'labelstyle', 'prefix'],
    components : {
    },

    data : function(){
      return {
        value : new BigNumber("0"),
        step: new BigNumber("0.0005"),
        removed : false,
      }
    },

    beforeDestroy(){
      this.removed = true;
    },

    methods : {
      getDiff(a,b){
        return this.value.abs().minus(this.target.abs()).abs();
      },

      lerp(){
        if(this.target){
          this.step = this.target.minus(this.value).div(50);
          let diff = this.getDiff(this.value, this.target);

          if(this.instant !== undefined && first){
            first = false;
            if(diff.gt(0))
              this.value = this.target;

            if(!this.removed){
              setTimeout(()=>{
                this.lerp();
              }, 10);
            }
          }else{
            if(diff.lt(this.jumpprecision ? this.jumpprecision : 0.001)){
              this.value = this.target;
              this.step = new BigNumber(0);
            }else{
              this.value = this.value.plus(this.step);
            }

            if(!this.removed){
              setTimeout(()=>{
                this.lerp();
              }, 10);
            }
          }
        }
      }
    },

    computed : {
      number_parts () {
        let parts = this.value.toFixed(this.places != null ? this.places : 2).toString().split(".");
        let parts2 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",").split(",");
        return parts2;
      },
      decimal_parts () {
        let parts = this.value.toFixed(this.places != null ? this.places : 2).toString().split(".");
        return parts[1];
      },
      red_style(){
        return {
          'font-size': '1em',
          //...this.mystyle,
          color:'red'
        };
      },
      green_style(){
        return {
          'font-size': '1em',
          //...this.mystyle,
          color:'green'
        };
      }
    },

    created(){
      if(this.mystyle && this.mystyle.fontSize){
        this.mystyle['font-size'] = this.mystyle.fontSize;
        delete this.mystyle.fontSize;
      }
      this.lerp();
      if(this.start)
      {
        this.value = new BigNumber(this.start);
      }
      else
      {
        this.value = this.target;
      }
    }
  }
</script>

<style scoped>
    .funds {
        pointer-events:none;
        white-space: nowrap;
        line-height: 1;
    }
     .fund_part{
        font-family: monospace;
        background-color: rgba(30,30,30,0.7);
        color : rgba(7,190,215,1);
        padding:0;
        border-radius:15px;
        margin:0;
        font-size:4em;
    }
    .num{
    }
    .fund-dot{
      position: relative;
      margin-left: -.15em;
      margin-right: -.2em;
    }
    .comma{
      position: relative;
      margin-left: -.3em;
      margin-right: -.1em;
    }
    .first
    {
    }
</style>