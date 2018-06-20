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
</style>
