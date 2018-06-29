<template>
  <div class='container-fluid'>
      <div class="fixed-bg"></div> 
      <vue-particles class="particles_bg" color="#02E1FF" linesColor="#02E1FF" :clickEffect="false"></vue-particles>
      <Navbar :color="'rgba(7,190,215,1)'"/>
      <Notifications :notifications="notifications"/>
      <NoExtensionWarning v-if="is_wallet_missing"/>
      <div v-if="game !== null"> 
        <LaunchIco :onClickLaunch="launchICO" v-if="game.active_ico === undefined"/>
        <Airdrops 
          :game="game" 
          :status="status"
          :isMyGame="isMyGame"
          v-if="isMyGame() && game !== null && (game.current_event !== null || game.blocks_till_next_event)" />
        <div class='row'>
            <div class='col-lg-12'>
                <Details :isMyGame="isMyGame" :game="game"/>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-6">
                <Items 
                  :isTeam="false" 
                  :items="game.roadmap_steps"
                  :selections="selections"
                  :isMyGame="isMyGame"
                  :status="status" />
            </div>
            <div class="col-xl-6">
                <Items 
                  :isTeam="true"
                  :items="game.team_members" 
                  :selections="selections"
                  :isMyGame="isMyGame"
                  :status="status" />
            </div>
        </div>
      </div>
       <Loading v-else/>
      <Footer />
  </div>
</template>

<script>
import {BigNumber} from 'bignumber.js';

import Navbar from './Navbar.vue';
import FundsContainer from './FundsDisplay';
import Items from './Items';
import Airdrops from './Airdrops';
import Details from './Details';
import NoExtensionWarning from './NoExtensionWarning';
import LaunchIco from './LaunchIco';
import Loading from './Loading';
import Footer from './Footer';

import neb from "../logic/HardlyNeb.js";
import Notifications from "./Notifications";
const game = require("../logic/game.js");

export default {
  name: 'Home',
  data () {
    return {
      // data
      game: null,
      selections: {},
      explorer_smart_contract_url: null,
      smart_contract_address: null,
      ticker_is_available: false, // for Launch ICO form
      is_wallet_missing: false, // for new user help
      notifications : []
    }
  },
  components: {
    Notifications,
    Navbar,
    FundsContainer,
    Items,
    Airdrops,
    Details,
    NoExtensionWarning,
    LaunchIco,
    Loading,
    Footer,
  },

  computed : {
    status(){
      return {
        onTxPosted : this.onTxPosted,
        onSuccess : this.onSuccess,
        onError : this.onError
      }
    }
  },

  methods: {
    showNotification(title, message, href = null, href_text = null, length=3000){
      this.notifications.push({
        title : title,
        message : message,
        href :href,
        href_text : href_text,
        length : length
      });
    },

    onTxPosted(resp) {
      this.showNotification("Transaction posted", '', 'https://explorer.nebulas.io/#/tx/' + resp.txhash, 'Open in Explorer');
      console.log(resp);
    },

    onError(error) {
      this.showNotification("Error", error);
      console.log(error);
    },

    onSuccess(resp) {
      this.showNotification("Great Success!", resp);
      console.log(resp);
    },

    // Write
    launchICO(icoName, icoTicker) {
      console.log(`launching ico ${icoName} ticker ${icoTicker}`);
      game.launchICO(icoName, icoTicker, this.onTxPosted, (resp) => {
        this.$router.push({name : 'ico', params : {ticker:  this.launch_ico_ticker}});
        onSuccess(resp);
      }, this.onError);
    },
    
    // Read
    isMyGame()
    {
      if(!this.game.active_ico)
      {
        return false;
      }
      return this.game.active_ico.is_you;
    },
    getGame()
    {
      game.getGame((resp) =>
      {
        this.game = resp;

        if(this.game.active_ico && !this.$route.params.ticker && this.$route.name === 'Home'){
          this.$router.push({name : 'ico', params : {ticker:  this.game.active_ico.ticker}});
        }else {
          //this.$router.push({name : '', params : {ticker: ''}});
        }
        
        if(this.game.active_ico)
        {
          this.game.active_ico.estimated_resources = this.game.active_ico.resources;
          this.game.active_ico.date_of_last_refresh = Date.now();
        }

        this.game.roadmap_steps = [];
        this.game.team_members = [];

        for(let i = 0; i < this.game.items.length; i++)
        { // Init default user selections
          let item = this.game.items[i];
          let selection = this.selections[item.name];
          if(selection == null){
            let newSelections = {...this.selections};
            newSelections[item.name] = {
              number_to_buy: 0
            };
            this.selections = newSelections;
          }

          if(this.selections[item.name].number_to_buy_with_nas == null)
          {
            this.selections[item.name].number_to_buy_with_nas = 1;
          }

          if(item.user_max_can_afford <= 0)
          {
            this.selections[item.name].number_to_buy = 0;
          }
          else if(!this.selections[item.name].number_to_buy)
          {
            this.selections[item.name].number_to_buy = 1;
          }

          //roadmap
          if(item.resources_per_s !== null)
          {
            this.game.roadmap_steps.push(item);
          }
          else
          {
            this.game.team_members.push(item);
          }
        }

        setTimeout(this.getGame, game.auto_refresh_time);
      }, (error) =>
      {
        if(!this.game)
        { // Retry right away
          return this.getGame();
        }
        setTimeout(this.getGame, game.auto_refresh_time);
      });
    },
    checkTicker()
    {
      game.getIsTickerAvailable(this.launch_ico_ticker, () =>
      {
        this.ticker_is_available = true;
      }, () =>
      {
        this.ticker_is_available = false;
      })
    },
  },
  mounted() {
    this.smart_contract_address = game.getSmartContractAddress();
    this.explorer_smart_contract_url = game.getBlockExplorerURLForContract();
    if(this.$route.params.ticker)
    {
      game.setTicker(this.$route.params.ticker);
    }

    this.getGame();

    setTimeout(() =>
    { // It takes a second for the wallet game to appear
      this.is_wallet_missing = !game.isWalletInstalled();
    }, 1000);

    setInterval(() =>
    {
      if(this.game && this.game.active_ico)
      {
        let time_passed = Date.now() - this.game.active_ico.date_of_last_refresh;
        let production = this.game.active_ico.total_production_rate
        this.game.active_ico.estimated_resources = this.game.active_ico.resources;
      }
    });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    *{
        color : #eee;
        font-family: 'Montserrat', sans-serif;
    }

    h1{
        font-size: 4em;
    }
    h1, h2 {
        font-weight: bold;
        color:white;
    }

    body{
        background-color: #202022;
    }

    .glow {
        -webkit-animation-duration: 1s;
        -webkit-animation-name: glow;
        -webkit-animation-direction: alternate;
        -webkit-animation-iteration-count: infinite;
        animation-duration: 10s;
        animation-name: glow;
        animation-direction: alternate;
        animation-iteration-count: infinite;
    }

    @-webkit-keyframes glow {
        from { text-shadow: 0 0 20px black; }
        to { text-shadow: 0 0 5px black; }
    }

    .particles_bg{
        position: absolute;
        top:0;
        left:0;
        right:0;
        height:100%;
    }
    .fixed-bg{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background-color: #202022;
        z-index: -1;
    }

</style>
