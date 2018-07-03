<template>
  <span class="funds">
    <span v-if="prefix" :style="labelstyle">{{this.prefix}}</span><span
     v-for="(part, index) in parts[0]" v-bind:key="'a' + index"><span 
     :class="index==0?'first':''" class="fund_part num" :style="mystyle">{{part}}</span>
      <span :style="mystyle" class="fund_part comma" v-if="index < parts[0].length - 1">,</span>
    </span>
    <span :style="mystyle" class="fund_part fund-dot" v-if="parts.length > 1 && parts[1].length > 0">.</span>
     <span v-for="(part, index) in parts[1]" v-bind:key="'b' + index">
      <span :style="mystyle" class="fund_part num">{{part}}</span>
    </span>
    <span v-if="label" :style="labelstyle">{{this.label}}</span>
      <span :style="mystyle">
      <i v-if="showdirection && step.gt(0)" class="fas fa-caret-up green"></i>
      <i v-else-if="showdirection && step.lt(0)" class="fas fa-caret-down red"></i>
      <i v-else-if="showdirection" class="fas fa-caret-right"
         :style="{fontSize : '1em', color:'transparent'}" ></i>
    </span>
  </span>
</template>

<script>
    import {BigNumber} from 'bignumber.js';
    let first = true;
    let interval = null;
    const auto_refresh_time = 50;
    
    export default {
    name: "FundsDisplay",
    props : ['target', 'mystyle', 'instant', 'showdirection', 'places', 'start', 'jumpprecision', 'label', 'labelstyle', 'prefix'],
    data : function()
    {
      return {
        value : new BigNumber("0"),
        step: new BigNumber("0.0005"),
      }
    },

    beforeDestroy(){
      clearInterval(interval);
    },

    methods : {
      lerp()
      {
        if(this.target == this.value)
        {
          return;
        }

        if(first && this.instant !== undefined)
        {
          this.value = this.target;
          first = false;
        }
        else
        {
          let diff = this.target.minus(this.value);
          this.step = diff.div(50);
          diff = diff.abs();

          if(diff.lt(this.precision))
          {
            this.value = this.target;
            this.step = new BigNumber(0);
          }
          else
          {
            this.value = this.value.plus(this.step);
          }
        }
      }
    },

    computed : {
      parts () 
      {
        let parts = this.value.toFixed(this.places != null ? this.places : 2).toString().split(".");
        let parts2 = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",").split(",");
        if(parts.length > 1)
        {
          return [parts2, parts[1]];
        }

        return [parts2];
      },
      precision()
      {
        return this.jumpprecision ? this.jumpprecision : .001;
      }
    },

    created()
    {
      if(this.mystyle && this.mystyle.fontSize)
      {
        this.mystyle['font-size'] = this.mystyle.fontSize;
        delete this.mystyle.fontSize;
      }
      if(this.start)
      {
        this.value = new BigNumber(this.start);
      }
      else
      {
        this.value = this.target;
      }
      this.lerp();  
      interval = setInterval(this.lerp, auto_refresh_time);      
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
    .green
    {
      font-size: '1em';
      color:'green'
    }
    .red
    {
      font-size: '1em';
      color:'red'
    }
</style>