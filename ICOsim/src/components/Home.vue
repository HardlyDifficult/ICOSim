<template>
  <div class='container-fluid'>
      <div class="fixed-bg"></div> 
      <Penis v-if="is_scam" />
      <vue-particles v-if="!is_scam" class="particles_bg" color="#02E1FF" linesColor="#02E1FF" :clickEffect="false"></vue-particles>
      <Navbar :color="'rgba(7,190,215,1)'"/>
      <Notifications :notifications="notifications"/>
      <NoExtensionWarning v-if="is_wallet_missing"/>
      <YouArePoorWarning v-if="insufficient_balance"/>
      <WrongNetworkWarning v-if="is_wrong_network"/>
      <div v-if="game !== null"> 
        <LaunchIco :onClickLaunch="launchICO" v-if="game.active_ico === undefined && !is_wallet_missing && !insufficient_balance"/>
        <Airdrops 
          :game="game" 
          :status="status"
          :isMyGame="isMyGame"
          v-if="!is_scam && isMyGame() && game !== null && (game.current_event !== null || game.blocks_till_next_event)" />
        <div class='row'>
            <div class='col-lg-12'>
                <Details 
                  :isscam="is_scam"
                  :isMyGame="isMyGame" 
                  :game="game"
                  :ico="ico"
                  :totalplayerresources="totalplayerresources"/>
            </div>
        </div>
        <div class="row">
            <div class="col-xl-6">
                <Items
                  :game="game"
                  :isTeam="false" 
                  :items="game.roadmap_steps"
                  :selections="selections"
                  :isMyGame="isMyGame"
                  :status="status" />
            </div>
            <div class="col-xl-6">
                <Items
                  :game="game"
                  :isTeam="true"
                  :items="game.team_members" 
                  :selections="selections"
                  :isMyGame="isMyGame"
                  :status="status" />
            </div>
        </div>
      </div>
       <Loading v-if="game==null && !is_wallet_missing && !insufficient_balance && !is_wrong_network"/>
      <Footer />
      <!--<Particles/>-->
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
import YouArePoorWarning from './YouArePoorWarning';
import WrongNetworkWarning from './WrongNetworkWarning';
import LaunchIco from './LaunchIco';
import Loading from './Loading';
import Footer from './Footer';
import Modal from './Modal';
import Particles from './Particles';

import neb from "../logic/HardlyNeb.js";
import Notifications from "./Notifications";
import Penis from "./Penis";
const game = require("../logic/game.js");
let is_destroyed = false;
let get_game_timeout = null;

function b64DecodeUnicode(str) {
  // Going backwards: from bytestream, to percent-encoding, to original string.
  return decodeURIComponent(atob(str).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

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
      notifications : [],
      totalplayerresources: null,
      show_help_modal : false,
      insufficient_balance: false,
      is_wrong_network: false,
      ico: null,
      is_scam: false
    }
  },
  components: {
    Particles,
    Notifications,
    Penis,
    Navbar,
    FundsContainer,
    Items,
    Airdrops,
    Details,
    NoExtensionWarning,
    YouArePoorWarning,
    WrongNetworkWarning,
    LaunchIco,
    Loading,
    Footer,
    Modal
  },

  computed : {
    status(){
      return {
        onTxPosted : this.onTxPosted,
        onSuccess : this.onSuccess,
        onError : this.onError
      }
    },
   
  },

  methods: {
    showNotification(title, message, href = null, href_text = null, length=3000, noAutoRemove = false){
      this.notifications.push({
        title : title,
        message : message,
        href :href,
        href_text : href_text,
        length : length,
        no_auto_remove : noAutoRemove
      });
    },

    onTxPosted(resp) {
      this.showNotification( "Transaction posted", '', game.getBlockExplorerURLForTx(resp.txhash), 'Open in Explorer',3000,true);
      console.log(resp);
    },

    onError(error) 
    {
      if(error == "Error: Transaction rejected by user"
        || error == "Error: Network Error")
      { // Ignore
        return;
      }
      if(error == "Error: contract check failed")
      {
        this.is_wrong_network = true;
        return;
      }
      this.showNotification("Error", error);
      console.log(error);
    },

    getSuccessMessage(resp){
      try{
        let obj = JSON.parse(b64DecodeUnicode(resp.data));
        if(obj['Function'] === 'buy'){
          let args = JSON.parse(obj['Args']);
          return `Bought ${args[1]} [${args[0]}]`;
        }
      }catch (e) {
        console.log(e);
      }
      return '';
    },

    onSuccess(resp) {
      if(get_game_timeout)
      {
        clearTimeout(get_game_timeout);
      }
      this.getGame();
      this.showNotification( "Transaction successful", this.getSuccessMessage(resp), game.getBlockExplorerURLForTx(resp.hash), 'Open in Explorer', 3000,false);
      console.log(resp);
    },

    // Write
    launchICO(icoName, icoTicker) {
      console.log(`launching ico ${icoName} ticker ${icoTicker}`);
      game.launchICO(icoName, icoTicker, this.onTxPosted, (resp) => {
        this.$router.push({name : 'ico', params : {ticker:  this.launch_ico_ticker}});
        this.onSuccess(resp);
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
    getGame(is_anon)
    {
      game.getGame((resp) =>
      {
        if(is_destroyed)
        {
            return;
        }
        if(this.is_wrong_network)
        {
          return;
        }
        if(resp.active_ico && !this.$route.params.ticker && this.$route.name === 'Home'){
          this.$router.push({name : 'ico', params : {ticker:  resp.active_ico.ticker}});
        }else {
          //this.$router.push({name : '', params : {ticker: ''}});
        }
        
        if(resp.active_ico)
        {
          resp.active_ico.original_resources = resp.active_ico.resources;
          resp.active_ico.date_of_last_refresh = Date.now();
        }

        resp.roadmap_steps = [];
        resp.team_members = [];

        for(let i = 0; i < resp.items.length; i++)
        { // Init default user selections
          let item = resp.items[i];
          let selection = this.selections[item.name];
          if(selection == null) 
          {
            let newSelections = {...this.selections};
            newSelections[item.name] = {
              number_to_buy: item.user_max_can_afford
            };
            this.selections = newSelections;
          }

          if(this.selections[item.name].number_to_buy_with_nas == null)
          {
            this.selections[item.name].number_to_buy_with_nas = 1;
          }

          if(!this.selections[item.name].number_to_buy
            || this.selections[item.name].number_to_buy > item.user_max_can_afford)
          {
            this.selections[item.name].number_to_buy = item.user_max_can_afford;
          }

          if(this.selections[item.name].number_to_buy == this.selections[item.name].previous_max)
          {
            this.selections[item.name].number_to_buy = item.user_max_can_afford;
          }

          //roadmap
          if(item.resources_per_s !== null)
          {
            resp.roadmap_steps.push(item);
          }
          else
          {
            resp.team_members.push(item);
          }

          this.selections[item.name].previous_max = item.user_max_can_afford;
        }

        this.game = resp;
        this.is_scam = this.game != null && this.game.active_ico != null && this.game.active_ico.exit_amount != null;
        
        if(resp.active_ico)
        {
          this.estimateProduction();
        }

        if(!is_anon)
        {
          get_game_timeout = setTimeout(this.getGame, game.auto_refresh_time);
        }
      },
      (error) =>
      {
        if(is_destroyed)
        {
            return;
        }
        if(error == "insufficient balance")
        {
          this.insufficient_balance = true;
          this.getGame(true);
          return;
        }
        if(error == "contract check failed")
        {
          this.is_wrong_network = true;
          return;
        }
        if(!this.game)
        { // Retry right away
          get_game_timeout = setTimeout(this.getGame, 3000);
          return;
        }
        get_game_timeout = setTimeout(this.getGame, game.auto_refresh_time);
      }, is_anon);
    },
    getICO()
    {
      if(!this.game || !this.game.active_ico)
      {
        setTimeout(this.getICO, 3000);
        return;
      }
      game.getICO(this.game.active_ico.id, (resp) =>
      {
        if(is_destroyed)
        {
            return;
        }

        this.ico = resp;
        setTimeout(this.getICO, game.auto_refresh_time);
      },
      (error) =>
      {
        if(is_destroyed)
        {
            return;
        }
        setTimeout(this.getICO, game.auto_refresh_time);
      });
    },
    getTotalResources()
    {
      game.getTotalResources((resp) =>
      {
        if(is_destroyed)
        {
            return;
        }
        if(this.is_wrong_network)
        {
          return;
        }
        this.totalplayerresources = {
          value: resp,
          date: Date.now()
        };

        setTimeout(this.getTotalResources, game.auto_refresh_time);
      },
      (error) =>
      {
        if(is_destroyed)
        {
            return;
        }
        setTimeout(this.getTotalResources, game.auto_refresh_time);
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
    estimateProduction()
    {
      if(this.is_scam)
      {
        return;
      }
      if(this.game && this.game.active_ico)
       {
        let time_passed = Date.now() - this.game.active_ico.date_of_last_refresh;
        this.game.active_ico.production = this.game.active_ico.total_production_with_bonus.mul(time_passed / 1000);
        this.game.active_ico.resources = this.game.active_ico.original_resources.plus(this.game.active_ico.production);
       }
    }
  },
  mounted() {
    this.smart_contract_address = game.getSmartContractAddress();
    this.explorer_smart_contract_url = game.getBlockExplorerURLForContract();
    if(this.$route.params.ticker)
    {
      game.setTicker(this.$route.params.ticker);
    }

    this.getGame();
    this.getTotalResources();
    this.getICO();

    setTimeout(() =>
    { // It takes a second for the wallet game to appear
      this.is_wallet_missing = !game.isWalletInstalled();
    }, 1000);

    let interval = setInterval(() =>
    {
      if(is_destroyed)
      {
        clearInterval(interval);
        return;
      }
      this.estimateProduction();
    }, game.number_refresh_time);
  },
  destroyed()
  {
    console.log("Home destroyed");
    is_destroyed = true;
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
