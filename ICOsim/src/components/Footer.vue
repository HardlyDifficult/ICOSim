<template>
    <div class="row footer mt-5">
        <div class="col">
            <br><br>
            {{ $t("footer.redistributed") }}. 
            {{ $t("footer.created_by") }} <a target="_blank" href="https://youtube.com/HardlyDifficult">HardlyDifficult</a> &amp; Metjm.
            {{ $t("footer.view_the") }} <a target="_blank" v-bind:href="explorer_smart_contract_url">{{ $t("footer.smart_contract") }}</a>.
            <br>{{ $t("footer.questions") }}? 
            {{ $t("footer.join_our") }} <a target="_blank"  class="highlight underline" href="https://discord.gg/2bsDfkv">
            {{ $t("footer.discord") }}</a>.
            <br>{{ $t("footer.dont_spend_more_than") }}.
        </div>
    </div>
</template>

<script>
let game = require("../logic/game.js");

export default {
    name: "Footer",
    data() { return {
        explorer_smart_contract_url: null,
        smart_contract_address: null,
    }},
    components : {

    },
    mounted() 
    {
        this.smart_contract_address = game.getSmartContractAddress();
        this.explorer_smart_contract_url = game.getBlockExplorerURLForContract();
    }
}
</script>

<style scoped>
.footer
{
    color: white;
    font-size: .75em;
}
</style>