<template>
  <div class='container-fluid'>
      <div class="fixed-bg"></div><!--super stupid workaround-->
      <vue-particles class="particles_bg" color="#02E1FF" linesColor="#02E1FF" :clickEffect="false"></vue-particles>
      <Navbar :color="'rgba(7,190,215,1)'"/>
      <!--<NoExtensionWarning/>-->
      <span v-if="game !== null"> <!--TODO: show loading instead-->
        <LaunchIco :onClickLaunch="launchICO" v-if="game.active_ico === undefined"/>
        <Airdrops 
          :game="game" 
          :redeemEvent="redeemEvent" 
          :isMyGame="isMyGame"
          v-if="game !== null && (game.current_event !== null || game.blocks_till_next_event)" />
        <div class='row'>
            <div class='col-lg-6'>
                <FundsContainer :showdirection=1 :target="playerResources"/>
            </div>
            <div class='col-lg-6'>
                <Details :game="game"/>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <Items 
                  :isTeam="false" 
                  :items="game.roadmap_steps"
                  :selections="selections"
                  :isMyGame="isMyGame"
                  :status="status" />
            </div>
            <div class="col-lg-6">
                <Items 
                  :isTeam="true"
                  :items="game.team_members" 
                  :selections="selections"
                  :isMyGame="isMyGame"
                  :status="status" />
            </div>
        </div>
      </span>

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

import neb from "../logic/HardlyNeb.js";
const game = require("../logic/game.js");

function onTxPosted(resp)
{
  console.log(`onTxPosted not implemented in Home.vue`);
  console.log(resp);
  //showStatus("Tx Posted", resp.txhash, 5000); // TODO status display
}

function onError(error)
{
  console.log(`onError not implemented in Home.vue`);
  console.log(error);
  //showStatus("Error", error, 15000);
}

function onSuccess(resp)
{
  console.log(`onSuccess not implemented in Home.vue`);
  console.log(resp);
  //showStatus("Success", JSON.stringify(resp), 3000);
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
      status: {onTxPosted, onSuccess, onError}
    }
  },
  components: {
    Navbar,
    FundsContainer,
    Items,
    Airdrops,
    Details,
    NoExtensionWarning,
    LaunchIco
  },

  computed : {
    playerResources(){
      return (this.game && this.game.active_ico) ? new BigNumber(this.game.active_ico.resources) : new BigNumber(0);
    }
  },

  methods: {
    // Write
    launchICO(icoName, icoTicker)
    {
      console.log(`launching ico ${icoName} ticker ${icoTicker}`);
      game.launchICO(icoName, icoTicker, onTxPosted, (resp) =>
      {
        window.location.search = this.launch_ico_ticker; // TODO router..
        onSuccess(resp);
      }, onError);
    },
    
    invest()
    {
      game.invest(this.amount_to_invest, this.onTxPosted, this.onSuccess, this.onError);
    },
    exitScam()
    {
      game.exitScam(this.onTxPosted, this.onSuccess, this.onError);
    },
    redeemEvent()
    {
      game.redeemEvent(this.onTxPosted, this.onSuccess, this.onError);
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

        // TODO use router?
        if(this.game.active_ico)
        {
          window.location.search = this.game.active_ico.ticker;
        }
        else if(window.location.search)
        {
          window.location.search = "";
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

          //every number is a bignumber
          item.start_price = new BigNumber(item.start_price);
          if(item.resources_per_s)
              item.resources_per_s = new BigNumber(item.resources_per_s);
          item.nas_price = new BigNumber(item.nas_price);
          item.user_holdings = parseInt(item.user_holdings);
          item.user_price = new BigNumber(item.user_price);
          if(item.user_item_bonus)
          {
            item.user_item_bonus = new BigNumber(item.user_item_bonus);
          }
          else
          {
            item.user_item_production = new BigNumber(item.user_item_production);
          }
          item.user_max_can_afford = parseInt(item.user_max_can_afford);

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
      });
    },
    getBestKnownScammers()
    {
      game.getBestKnownScammers(null, null, (resp) =>
      {
        this.best_known_scammers = resp;
      }, onError);
    },
    getCoinMarketCaps()
    {
      game.getCoinMarketCaps(null, null, (resp) =>
      {
        this.coin_market_caps = resp;
      }, onError);
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

    // For Debugging
    callMethodAsWrite()
    {
      if(this.method_to_call_args === "")
      {
        this.method_to_call_args = null;
      }
      let args = null;
      if(this.method_to_call_args)
      {
        args = this.method_to_call_args.split(",");
      }
      game.directNebWrite(this.method_to_call, args, onTxPosted, 0, onSuccess, onError);
    },
    callMethodAsRead()
    {
      if(this.method_to_call_args === "")
      {
        this.method_to_call_args = null;
      }
      let args = null;
      if(this.method_to_call_args)
      {
        args = this.method_to_call_args.split(",");
      }
      game.directNebRead(this.method_to_call, args, onSuccess, onError);
    },
  },
  filters: {
    count(value)
    {
      return numberWithCommas(value);
    },
    date(value)
    {
      return new Date(value).toString();
    },
    percent(value)
    {
      return numberWithCommas(value) + "%";
    },
    decimal(value)
    {
      return numberWithCommas(value, 4);
    },
    price(value)
    {
      return numberWithCommas(value);
    },
    nas(value)
    {
      return formatCoins(value, 18);
    },
  },
  mounted() {
    this.smart_contract_address = game.getSmartContractAddress();
    this.explorer_smart_contract_url = game.getBlockExplorerURLForContract();
    if(window.location.search)
    {
      game.setTicker(window.location.search.substring(1)); // TODO routes
    }

    this.getGame();
    setInterval(this.getGame, 10000);

    setTimeout(() =>
    { // It takes a second for the wallet game to appear
      this.is_wallet_missing = !game.isWalletInstalled();
    }, 1000);
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
    }

</style>
