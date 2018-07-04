<template>
<span>
    <div class="row mb-5">
        <div class="col-lg-2"></div>
        <div class="col-xl-8 warning-container glow-1">
            <h3>You Need NAS</h3>
            <div class="row justify-content-center">
                <div class="modalbody">
                    <p>
                        The game is free to play, but you do need a small balance to cover gas.  
                        It seems you are out of money.  
                    </p>
                    <p>
                        Just post your address in our <a target="_blank"  class="highlight underline" href="https://discord.gg/2bsDfkv">Discord</a>.
                        You can also buy NAS from
                        <a target="_blank" class="highlight underline" href="https://binance.com/?ref=15811261">Binance</a>.
                    </p>
                    <small class="row justify-content-center mb-3 mt-3">
                        NAS transactions are super cheap, you can play for weeks for a just a penny.
                    </small>
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
    name: "YouArePoorWarning",
    data() {
      return {
      }
    },
    mounted () 
    {
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