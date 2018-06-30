<template>
<span>
    <div class="row mb-5">
        <div class="col-lg-2"></div>
        <div class="col-xl-8 warning-container glow-1">
            <h3>Getting Started</h3>
            <div class="row justify-content-center">
                <div class="modalbody">
                    <p>
                        To play ICOSim you need the Nebulas 
                        <a target="_blank" class="highlight underline" href="https://chrome.google.com/webstore/detail/nasextwallet/gehjkhmhclgnkkhpfamakecfgakkfkco">WebExtensionWallet</a>
                        and some NAS.
                        <br>
                        You can get more than enough NAS to play for FREE from 
                        <a target="_blank" class="highlight underline" href="http://givemenas.com/home.html">GiveMeNAS.com</a>
                    </p>
                    <small class="row justify-content-center mb-3 mt-3">
                        NAS transactions are super cheap, you can play for weeks for a just a penny.
                    </small>
                </div>
            </div>
        </div>
        <div class="col-lg-2"></div>
    </div>
    <div class="row mb-5 justify-content-center">
        <div class="col-lg-2"></div>
        <div class="col-xl-8 warning-container glow-1">
            <h3>About ICOSim.io</h3>
            <div class="row justify-content-center">
                <div class="modalbody">
                <p>
                    Launch your own coin, meet milestones on your roadmap, hire the best shillers in the business, and finally,
                    culminate all that worth into a lucrative exit scam. The path to your very own moon Lambo starts here*.
                </p>
                <p>
                    100% of NAS spent is redistributed to players who "Exit Scam".  
                    The value you may claim is determined by the ICOs market cap. 
                    So hype your ICO before you dump your bags.  
                </p>
                <p>
                    The amount you can get when exit scamming may go down when others play.
                    Once you "Exit Scam" you may start over by launching a new ICO.
                </p>
                <p>
                    Good Luck!
                </p>
                <small>
                    * May not prove profitable.  This is a game!  Do not spend more than you are willing to lose.
                    <br>
                    The funds are managed by our open-source 
                    <a target="_blank" v-bind:href="explorer_smart_contract_url">Smart Contract</a>.
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