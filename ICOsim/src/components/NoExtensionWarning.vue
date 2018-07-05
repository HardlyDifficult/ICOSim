<template>
<span>
    <div class="row mb-5">
        <div class="col-lg-2"></div>
        <div class="col-xl-8 warning-container glow-1">
            <h3>{{ $t("no_ext.getting_started") }}</h3>
            <div class="row justify-content-center">
                <div class="modalbody">
                    <p>
                        {{ $t("no_ext.to_play") }}
                        <a target="_blank" class="highlight underline" href="https://chrome.google.com/webstore/detail/nasextwallet/gehjkhmhclgnkkhpfamakecfgakkfkco">WebExtensionWallet</a>
                        {{ $t("no_ext.and_some_nas") }}.
                    </p>
                    <p>
                        {{ $t("no_ext.ill_give_you") }} <a target="_blank"  class="highlight underline" href="https://discord.gg/2bsDfkv">Discord</a>.
                        {{ $t("no_ext.you_can_buy_from") }}
                        <a target="_blank" class="highlight underline" href="https://binance.com/?ref=15811261">Binance</a>.
                    </p>
                    <small class="row justify-content-center mb-3 mt-3">
                        {{ $t("no_ext.super_cheap") }}.
                    </small>
                </div>
            </div>
        </div>
        <div class="col-lg-2"></div>
    </div>
    <div class="row mb-5 justify-content-center">
        <div class="col-lg-2"></div>
        <div class="col-xl-8 warning-container glow-1">
            <h3>{{ $t("no_ext.about.title") }}</h3>
            <div class="row justify-content-center">
                <div class="modalbody">
                <p>
                    {{ $t("no_ext.about.p1") }}*.
                </p>
                <p>
                    {{ $t("no_ext.about.p2") }}
                </p>
                <p>
                    {{ $t("no_ext.about.p3") }}
                </p>
                <p>
                    {{ $t("no_ext.about.good_luck") }}
                </p>
                <small>
                    * {{ $t("no_ext.about.disclaimer") }}
                    <br>
                    {{ $t("no_ext.about.open_source") }}
                    
                    <a target="_blank" v-bind:href="explorer_smart_contract_url">
                        {{ $t("no_ext.about.smart_contract") }}
                    </a>.
                </small>
                <br>
                <br>
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