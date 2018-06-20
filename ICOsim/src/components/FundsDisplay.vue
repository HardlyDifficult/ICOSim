<template>
    <div class="row">
        <div class="col">
            <div class="funds">
                <span class="fund_part"><i class="fas fa-dollar-sign"></i></span>
                <span class="fund_part" v-for="(part, index) in fund_parts" v-bind:key="index">{{part}}</span>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "FundsDisplay",
    props : ['amount'],

    data : function(){
      return {
        fund_parts : [
          "1",
          "000",
          "000",
          ".",
          "49"
        ]
      }
    }
  }
</script>

<style scoped>
    .funds {

    }
    .fund_part{
        background-color: rgba(30,30,30,0.7);
        color : rgba(15,77,175,1);
        padding:10px;
        border-radius:15px;
        margin:0px;
        font-size:4em;
    }
    .dollar{
        color : #0f4daf;
    }
</style>