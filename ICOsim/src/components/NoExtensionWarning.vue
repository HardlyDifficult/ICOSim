<template>
    <div class="row">

        <div class="col-lg-3"></div>
        <div class="col-lg-6 warning-container glow-1">
        <h3>Hello! looks like you're new here.</h3>
            <p>
                To play ICOSim you need the Nebulas <a target="_blank" class="highlight underline" href="https://chrome.google.com/webstore/detail/nasextwallet/gehjkhmhclgnkkhpfamakecfgakkfkco">WebExtensionWallet</a> <a target="_blank" class="highlight underline" href="https://github.com/nebulasio/WebExtensionWallet">(Github)</a> and some <a target="_blank" class="highlight underline" href="http://givemenas.com/home.html">NAS</a>.<br>
                No worries, you can get more than enough NAS to play for FREE from <a target="_blank" class="highlight underline" href="http://givemenas.com/home.html">givemenas.com</a><br>
                <small>
                NAS transactions are super cheap so even a fraction of a cent will allow you to play for weeks.<br>
                Reload this page when you have the wallet installed and a small amount of NAS in your account.
                </small>
            </p>
        </div>
        <div class="col-lg-3"></div>
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