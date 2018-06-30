<template>
    <div class="row mb-5">
        <div class="col-lg-1"></div>
        <div class="col-lg-10 warning-container glow-1">
        <h3>Getting Started</h3>
        <div class="row justify-content-center">

            <div class="modalbody">
            <p>
                To play ICOSim you need the Nebulas <a target="_blank" class="highlight underline" href="https://chrome.google.com/webstore/detail/nasextwallet/gehjkhmhclgnkkhpfamakecfgakkfkco">WebExtensionWallet</a>
                 and some 
               NAS.<br>
                You can get more than enough NAS to play for FREE from 
                <a target="_blank" class="highlight underline" href="http://givemenas.com/home.html">GiveMeNAS.com</a><br>
            </p>
            <small class="row justify-content-center mb-3">
                NAS transactions are super cheap, you can play for weeks for a just a penny.
            </small>
        </div>
            </div>
        </div>
        <div class="col-lg-1"></div>
    </div>
</template>

<script>
  export default {
    name: "NoExtensionWarning"
  }
</script>

<style scoped>
    .warning-container{
        border: 1px solid #00BDD3;
        background-color: rgba(0,0,0,0.9);
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

</style>