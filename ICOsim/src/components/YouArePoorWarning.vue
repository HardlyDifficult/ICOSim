<template>
<span>
    <div class="row mb-5">
        <div class="col-lg-2"></div>
        <div class="col-xl-8 warning-container glow-1">
            <h3>{{ $t("poor.title") }}</h3>
            <div class="row justify-content-center">
                <div class="modalbody">
                    <p>
                        {{ $t("poor.p1") }}
                    </p>
                    <p>
                        {{ $t("poor.post_to_discord") }} <a target="_blank"  class="highlight underline" href="https://discord.gg/2bsDfkv">Discord</a>.
                        {{ $t("poor.or_buy_from") }}
                        <a target="_blank" class="highlight underline" href="https://binance.com/?ref=15811261">Binance</a>.
                    </p>
                    <small class="row justify-content-center mb-3 mt-3">
                        {{ $t("poor.nas_is_cheap") }}
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