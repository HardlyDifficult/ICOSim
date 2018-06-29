<template>
    <div class="launchform">
        <div class="col-lg-3"></div>
        <div class="col-lg-6 container">
            <h3>Welcome! <i style="cursor:pointer" @click="$refs.helpModal.show()" class="fas fa-question-circle"></i></h3>
            
            <div class="row mt-3">
                <div class="col">Time to launch an ICO. Please check your morals at the door.</div>
            </div>
            <div class="row">
                <div class="col-2"></div>
                <div class="col-8 align-content-center form">
                    Name:
                    <input v-model="coin_name" class="inp form-control" type="text" title="ico-name" placeholder="BitConnect"/>
                    <br>
                    Ticker:
                    <input v-model="coin_ticker" class="inp form-control" style="text-transform: uppercase;" type="text" title="ico-name" placeholder="BCC"/>
                </div>
                <div class="col-2"></div>
            </div>
            <div class="col-12 mt-2">
                <button class="btn btn-primary" @click="launch">Launch ICO</button>
            </div>
        </div>
        <div class="col-lg-3"></div>
        <Modal ref="helpModal">
            <h3>About ICOSim.io</h3>
            <div style="max-width:40em">
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

            <p class="disclaimer">
                * May not prove profitable.  This is a game!  Do not spend more than you are willing to lose.
                <br>
                The funds are managed by our open-source 
                <a target="_blank" v-bind:href="explorer_smart_contract_url">Smart Contract</a>.
            </p>
            </div>
        </Modal>
    </div>
</template>

<script>
  import Modal from './Modal';
const game = require("../logic/game.js");


  export default {
    name: "LaunchIco",
    data() {
      return {
        coin_name : '',
        coin_ticker : '',
        explorer_smart_contract_url: null,
      }
    },
    mounted () 
    {
        this.explorer_smart_contract_url = game.getBlockExplorerURLForContract();
    },
    
    components : {
      Modal
    },
    props : ["onClickLaunch"],
    methods : {
      launch(){
        console.log('launching');
        this.onClickLaunch(this.coin_name, this.coin_ticker);
      }
    }
  }
</script>

<style scoped>
    .inp{
        color: black;
        width: 15em;
        display: inline-block;
    }
    .container{
        border: 1px solid #00BDD3;
        background-color: rgba(0,0,0,0.9);
        padding-top:.5em;
        padding-bottom:1em;
    }
    .highlight {
        color: #00BDD3;
    }
    .underline{
        text-decoration:underline;
    }
    h3{
        padding-top:.5em;
    }
    .btn, input{
        margin-top:1em;
    }

    .disclaimer 
    {
        font-size: .75em;
    }
    .fas
    {
        font-size: .6em;
        vertical-align:top;
    }
    .form
    {
        white-space: nowrap;
    }
    .launchform
    {
        padding-bottom: 2em;
    }
</style>