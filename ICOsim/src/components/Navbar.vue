<template>
    <div class="row navbar">
        <div class="col-sm-2">
            <a class="navbar-icosim" :style="{color : color}" href="/">
                <img src="../assets/icosim.png"/>
            </a>
        </div>
        <div class="col-sm-8">
            <a class="navbar-item" :style="{color : color}" href="/">
                {{ $t("nav.home") }}
            </a>
            |
            <router-link class="navbar-item" :style="{color : color}" to="/icos">
                {{ $t("nav.icos") }}
            </router-link>
            |
            <a class="navbar-item" :style="{color : color}" href="#/faq">
                {{ $t("nav.faq") }}
            </a>
        </div>
        <div class="col-sm-2"> 
            <LocalChanger />
        </div>
    </div>
</template>

<script>
import LocalChanger from './LocalChanger';

export default {
  name: "Navbar",
  props : ['color'],
  components: {
    LocalChanger,
  },
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