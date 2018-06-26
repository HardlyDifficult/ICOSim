<template>
    <div class="row airdrops-container">
        <h1>
            Airdrop
        </h1>
        <div class="col">
            <div class="col" v-if="!game.current_event || game.current_event.number_of_blocks_remaining == 0 || game.current_event.user_has_redeemed">
                Next Event starts in: {{ game.blocks_till_next_event | count }} blocks
            </div>
            <span v-else>
                <div class="col-12">
                    Expected Reward: {{ game.current_event.expected_reward | count }}
                </div>
                <div class="col-12">
                    Blocks Remaining: {{ game.current_event.number_of_blocks_remaining | count }}
                </div>
                <div class="col-12" v-if="isMyGame()">
                    <button @click="redeemEvent()" class="btn btn-primary">Redeem</button>
                </div>
            </span>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Airdrops",

    props : ['game', 'redeemEvent', 'isMyGame'],

    components : {
    },

    methods : {
     
    },
    filters: {
        count(value) 
        {
            return numberWithCommas(value);
        },
    }
  }

// From https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x, decimals) => 
{
    if(decimals == null)
    {
        decimals = 0;
    }
    let parts = Number.parseFloat(x).toFixed(decimals).split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
}
</script>

<style scoped>

    .airdrops-container{
        position: relative;
    }

</style>