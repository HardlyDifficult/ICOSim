<template>
    <div class="launchform">
        <div class="col-lg-3"></div>
        <div class="col-lg-6 container">
            <h3>{{ $t("launch.welcome") }}! <i style="cursor:pointer" @click="$refs.helpModal.show()" class="fas fa-question-circle"></i></h3>
            
            <div class="row mt-3">
                <div class="col">{{ $t("launch.intro") }}</div>
            </div>
            <div class="row">
                <div class="col-2"></div>
                <div class="col-8 align-content-center form">
                        {{ $t("launch.name") }}:
                        <input v-model="coin_name" class="inp form-control" type="text" title="ico-name" placeholder="BitConnect"/>
                        <br>
                        {{ $t("launch.ticker") }}:
                        <input v-model="coin_ticker" class="inp form-control" style="text-transform: uppercase;" type="text" title="ico-name" placeholder="BCC"  @change="checkTicker()" @input="checkTicker()" />
                        <i class="fa fa-check status_icon" v-if="ticker_is_available" aria-hidden="true"></i>
                        <i class="fa fa-spinner status_icon" aria-hidden="true" v-if="coin_ticker != '' && ticker_is_available == null"></i>
                        <span v-if="ticker_is_available == false">
                            <i class="fa fa-ban status_icon"  aria-hidden="true"></i>
                            {{ $t("launch.not_available") }}
                        </span>
                </div>
                <div class="col-2"></div>
            </div>
            <div class="col-12 mt-2">
                <button class="btn btn-primary" @click="launch">{{ $t("launch.launch_ico") }}</button>
            </div>
        </div>
        <div class="col-lg-3"></div>
        <Modal ref="helpModal">
            <h3>{{ $t("launch.about.title") }}</h3>
            <div class="modalbody">
                <p>
                    {{ $t("launch.about.p1") }}*.
                </p>
                <p>
                    {{ $t("launch.about.p2") }} 
                </p>
                <p>
                    {{ $t("launch.about.p3") }}
                    
                </p>
                <p>
                    {{ $t("launch.about.good_luck") }}
                </p>
                <p class="disclaimer">
                    * {{ $t("launch.about.disclaimer") }}
                    
                    <br>
                    {{ $t("launch.about.open_source") }}
                    <a target="_blank" v-bind:href="explorer_smart_contract_url">
                        {{ $t("launch.about.smart_contract") }}
                    </a>.
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
        ticker_is_available: null,
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
      },
        checkTicker()
        {
            this.ticker_is_available = null;
            let ticker = this.coin_ticker;
            game.getIsTickerAvailable(ticker, (resp) =>
            {
                if(ticker == this.coin_ticker)
                {
                    this.ticker_is_available = resp;
                }
            }, () =>
            {
                if(ticker == this.coin_ticker && this.ticker_is_available == null)
                {
                    setTimeout(this.checkTicker, 3000);
                }
            })
        },
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
    .status_icon
    {
        width: 2em;
    }
</style>