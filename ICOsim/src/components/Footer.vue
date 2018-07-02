<template>
    <div class="row footer mt-5">
        <div class="col">
            <br><br>
            100% of NAS spent is redistributed to players who "exit scam".
            Created by <a target="_blank" href="https://youtube.com/HardlyDifficult">HardlyDifficult</a> and Metjm.
            View the <a target="_blank" v-bind:href="explorer_smart_contract_url">Smart Contract</a>.
            <br>Questions, issues, or just want to hang out? Join our <a target="_blank"  class="highlight underline" href="https://discord.gg/2bsDfkv">Discord</a>.
            <br>Do not spend more than you are willing to lose.
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