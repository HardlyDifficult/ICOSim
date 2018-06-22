<template>
    <span class="fund_part" :style="mystyle" :class="getClasses()">{{content}}</span>
</template>

<script>
  export default {
    name: "FundNumber",
    props : ['mystyle', 'content'],
    methods :{
      getClasses(){
        if(/^\d+$/.test(this.content)){
          return ['num']
        }else{
          return [];
        }
      }
    }
  }
</script>

<style scoped>
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
        padding-left:0.1em;
        padding-right:0.1em;
    }
</style>