<template>
    <div class="row navbar">
        <div class="col-sm-2">
            <a class="navbar-icosim" :style="{color : color}" href="/">
                ICOSim
            </a>
        </div>
        <div class="col-sm-8">
            <a class="navbar-item" :style="{color : color}" href="/">
                Home
            </a>
            <router-link class="navbar-item" :style="{color : color}" to="/icos">
                ICos
            </router-link>
        </div>
        <div class="col-sm-2"> </div>
    </div>
</template>

<script>
export default {
  name: "Navbar",
  props : ['color']
}
</script>

<style scoped>
    *{
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    .navbar-item{
        margin-right: 10px;
        margin-left: 10px;
    }
    .navbar-icosim{
        font-size:2em;
    }

    .navbar{
        padding-bottom: 2em;
    }
</style>