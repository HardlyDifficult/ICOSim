<template>
  <div id="app">
    <vue-particles class="particles_bg" color="#02E1FF" linesColor="#02E1FF" :clickEffect="false"></vue-particles>
    <router-view/>
  </div>
</template>

<script>
  import '../node_modules/bootstrap/scss/bootstrap.scss';

  export default {
    name: 'App',
  }
</script>

<style>

  .particles_bg{
    position: absolute;
    top:0;
    left:0;
    right:0;
    height:100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .glow-1{
    -webkit-box-shadow: 0px 0px 35px 1px rgba(46,255,255,0.22);
    -moz-box-shadow: 0px 0px 35px 1px rgba(46,255,255,0.22);
    box-shadow: 0px 0px 35px 1px rgba(46,255,255,0.22);

  }

  .glow-cant-afford{
    -webkit-box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
    -moz-box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
    box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);

  }


</style>
