<template>
    <div class="row">
        <div class="col-sm-6"></div>
        <div class="col-lg-6">
            <div class="row">
                <div class="col-lg-12 title">
                    GrowthRate
                </div>
                <div class="col-lg-12 growth-container">
                    <FundsContainer :style="{fontSize:'0.5em'}" style="display:inline-block"/> per second
                </div>
            </div>
        </div>
    </div>
</template>

<script>
  import FundsContainer from './FundsDisplay';

  export default {
    name: "Details",

    components : {
      FundsContainer
    }

  }
</script>

<style scoped>

    .title{
        font-size:1.5em;
    }
    .growth-container{

    }
    .details-container{
        text-align:right;
    }

</style>