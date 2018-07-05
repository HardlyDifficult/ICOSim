<template>
<span>
    <span class="penis"><a href="http://www.businessinsider.com/cryptocurrencty-and-blockchain-startup-prodeum-pulled-an-exit-scam-2018-1">
        {{ $t("penis.penis") }}
    </a></span>
    <div class="whitebackground"></div>
    <div class="spacer"></div>
</span>
</template>

<script>
const game = require("../logic/game.js");
  export default {
    name: "NoExtensionWarning",
    data() {
      return {
        explorer_smart_contract_url: null,
      }
    },
    mounted () 
    {
        this.explorer_smart_contract_url = game.getBlockExplorerURLForContract();
    },
  }
</script>

<style scoped>
    .warning-container{
        border: 1px solid #00BDD3;
        background-color: rgba(0,0,0,0.9);
    }
    .highlight {
        color: #00BDD3;
    }
    .underline{
        text-decoration:underline;
    }
    h3{
        padding-top:10px;
    }
    .whitebackground
    {
        height:150vh;
        background-color: white;
        width: 100%;
        top: 0;
        left: 0;
        position: absolute;
        z-index: -1;
    }
    .penis a
    {
        top: .5em;
        position: absolute;
        color: black;
        font-size: 1.5em;
        left: .5em;
    }
    .spacer
    {
        height:150vh;
    }

</style>