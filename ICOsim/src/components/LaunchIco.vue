<template>
    <div class="row">
        <div class="col-lg-3"></div>
        <div class="col-lg-6 container">
            <h3>Welcome!</h3>
            <p>Time to launch an ICO. Please check your morals at the door.</p>
            <div class="row">
                <div class="col-3"></div>
                <div class="col-6 align-content-center">
                    <input class="inp form-control" type="text" title="ico-name" placeholder="Coin Name (eg Bitconnect)"/>
                    <input class="inp form-control" type="text" title="ico-name" placeholder="Coin Ticker (eg BCC)"/>
                </div>
                <div class="col-3"></div>
            </div>
            <div class="col-12">
                <button class="btn btn-primary">Launch ICO</button>
            </div>
        </div>
        <div class="col-lg-3"></div>
    </div>
</template>

<script>
  export default {
    name: "LaunchIco"
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