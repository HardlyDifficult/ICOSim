<template>
  <div id="app">
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


  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .glow-white{
    -webkit-box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
    -moz-box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
    box-shadow: 0px 0px 35px 1px rgba(255,255,255,0.22);
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
