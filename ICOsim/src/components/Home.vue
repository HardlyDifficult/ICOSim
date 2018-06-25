<template>
  <div class='container-fluid'>
      <vue-particles class="particles_bg" color="#02E1FF" linesColor="#02E1FF" :clickEffect="false"></vue-particles>
      <Navbar :color="'rgba(7,190,215,1)'"/>
      <!--<NoExtensionWarning/>-->
      <LaunchIco/>
      <div class='row'>
          <div class='col-lg-6'>
              <FundsContainer :target="user_funds"/>
          </div>
          <div class='col-lg-6'>
              <Details/>
          </div>
      </div>
      <div class="row">
          <div class="col-lg-6">
              <Team/>
          </div>
          <div class="col-lg-6">
              <Roadmap/>
          </div>
      </div>
  </div>
</template>

<script>
import {BigNumber} from 'bignumber.js';

import Navbar from './Navbar.vue';
import FundsContainer from './FundsDisplay';
import Roadmap from './Roadmap';
import Team from './Team';
import Details from './Details';
import NoExtensionWarning from './NoExtensionWarning';
import LaunchIco from './LaunchIco';

export default {
  name: 'Home',
  data () {
    return {
      user_funds : new BigNumber(1000000)
    }
  },
  components: {
    Navbar,
    FundsContainer,
    Roadmap,
    Team,
    Details,
    NoExtensionWarning,
    LaunchIco
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
        color: #0061FF;
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
</style>
