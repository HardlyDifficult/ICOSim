<template>
  <div class='container-fluid'>
      <Navbar/>
      <div class='row'>
          <div class='col-lg-12'>
              <h1 class="glow">ICOSim</h1>
          </div>

          <div class='col-lg-6'>
              <FundsContainer :amount="user_funds"/>
          </div>
      </div>
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import FundsContainer from './FundsDisplay';

export default {
  name: 'Home',
  data () {
    return {
      user_funds : 1000000
    }
  },
  components: {
    Navbar,
    FundsContainer
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
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
</style>
