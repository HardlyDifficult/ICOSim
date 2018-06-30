<template>
<span>
    <div class="row mb-5">
        <div class="col-lg-2"></div>
        <div class="col-xl-8 warning-container glow-1">
            <h3>Wrong Network!</h3>
            <div class="row justify-content-center">
                <div class="modalbody">
                    <p>
                        Please switch the NAS extension wallet to point to MAINNET.
                    </p>
                    <p>
                        Then refresh the page.
                    </p>
                </div>
            </div>
        </div>
        <div class="col-lg-2"></div>
    </div>
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