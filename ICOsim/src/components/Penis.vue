<template>
<span>
    Penis
    <div style="height:150vh"></div>
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

</style>