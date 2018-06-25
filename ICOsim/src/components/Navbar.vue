<template>
    <div class="row navbar">
        <div class="col-sm-2">
            <router-link class="navbar-icosim" to="/">
                ICOSim
            </router-link>
        </div>
        <div class="col-sm-8">
            <router-link class="navbar-item" to="/">
                Home
            </router-link>
            <router-link class="navbar-item" to="/icos">
                ICos
            </router-link>
        </div>
        <div class="col-sm-2"> </div>
    </div>
</template>

<script>
export default {
    name: "Navbar"
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