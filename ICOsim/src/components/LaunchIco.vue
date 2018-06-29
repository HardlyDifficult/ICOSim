<template>
    <div class="row">
        <div class="col-lg-3"></div>
        <div class="col-lg-6 container">
            <h3>Welcome!</h3>
            <p>Time to launch an ICO. Please check your morals at the door.</p>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6 align-content-center">
                    <input v-model="coin_name" class="inp form-control" type="text" title="ico-name" placeholder="Coin Name (eg Bitconnect)"/>
                    <input v-model="coin_ticker" class="inp form-control" style="text-transform: uppercase;" type="text" title="ico-name" placeholder="Coin Ticker (eg BCC)"/>
                </div>
                <div class="col-3"></div>
            </div>
            <div class="col-12">
                <button class="btn btn-primary" @click="launch">Launch ICO</button>
            </div>
        </div>
        <div class="col-lg-3"></div>
    </div>
</template>

<script>
  export default {
    name: "LaunchIco",
    data() {
      return {
        coin_name : '',
        coin_ticker : ''
      }
    },
    props : ["onClickLaunch"],
    methods : {
      launch(){
        console.log('launching');
        this.onClickLaunch(this.coin_name, this.coin_ticker);
      }
    }
  }
</script>

<style scoped>
    .inp{
        color: black;

    }
    .container{
        border: 1px solid #00BDD3;
        background-color: rgba(0,0,0,0.9);
        padding-top:15px;
        padding-bottom:30px;
    }
    .highlight {
        color: #00BDD3;
    }
    .underline{
        text-decoration:underline;
    }
    h3{
        padding-top:10px;
    }
    .btn, input{
        margin-top:15px;
    }

</style>