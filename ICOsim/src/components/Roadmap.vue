<template>
    <div class="row roadmap-container">
        <div class="col-sm-12">
            <h2>Roadmap</h2>
        </div>
        <template v-for="(step, index) in steps">
            <div class="col-6 roadmap-step" :key="index" :class="getStepClasses(step, index)">
                <div v-if="step.resources_per_s !== null" class="row roadmap-step-inner" @mouseover="step.mouseover=true" :class="(step.next_price > player_money) ? 'glow-cant-afford' : 'glow-1'">
                        <div class="col-12">
                            <div class="row">
                                <div class="col-12">
                                </div>
                                <div class="col-12">
                                    <p class="title">{{step.name}}</p>
                                </div>
                            </div>
                        </div>

                        <div class="col-12 line"></div>

                        <div class="col-4">
                            <p>Count: {{step.user_holdings}}</p>
                            <p>Production: {{step.user_item_production.toString()}}</p>
                        </div>
                        <div class="col-8">
                            <p>
                                Current Price
                            </p>
                            $<FundsContainer instant style="display:inline-block" :mystyle="{fontSize:'1.5em', backgroundColor:'transparent'}" :target="step.user_price"/>
                        </div>

                        <div class="col-12 line"></div>

                        <div class="col-12">
                            <div class="row cols-same-height">
                                <div class="col-4">
                                    <button @click="onBuy(step, step.number_to_buy.toString())" class="btn btn-buy">BUY</button>
                                </div>
                                <div class="col-8">
                                    <div class="row">
                                        <div class="col-12">
                                            BUY {{numbers_to_buy[step.name]}} FOR $ {{getBuyPrice(step)}}
                                        </div>
                                        <div class="col-12">
                                            <VueSlider
                                                    ref="slider"
                                                    v-model="numbers_to_buy[step.name]"
                                                    :speed="0"
                                                    :min="1"
                                                    :max="step.user_max_can_afford"
                                            ></VueSlider>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <div class="connecting-line" v-anime="line_animation"></div>
            </div>
        </template>
        <div class="middle-line"></div>
    </div>
</template>

<script>
  const game = require("../logic/game.js");
  import FundsContainer from './FundsDisplay';
  import VueSlider from 'vue-slider-component';

  export default {
    name: "Roadmap",

    props : ['steps', 'onBuy'],

    components : {
      FundsContainer,
      VueSlider
    },

    methods : {
      getStepClasses(step, index){
        let classes = [];
        classes.push(this.classes[index % 4]);


        if(parseInt(step.user_holdings) <= 0){
          classes.push('locked');
        }else{
          classes.push('unlocked');
        }

        if(step.user_max_can_afford > 0){
          classes.push('can_afford');
        }else{
          classes.push('cannot_afford');
        }

        return classes;
      },

      getBuyPrice(item) {
        return game.getBuyPrice(item, item.number_to_buy);
      }
    },


    data (){
      return {
        value : 5,
        line_animation: {

        } ,
        classes : [
          "step-1",
          "step-2",
          "step-3",
          "step-4"
        ],
        player_money : 75,
        numbers_to_buy : {

        }
      };
    },

  }
</script>

<style scoped>

    .roadmap-step-inner{
        background-color:rgba(0,0,0,0.6);

        border-radius : 5px 5px 5px 5px;
        padding:15px;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        margin-left:15px;
        margin-right:15px;
    }

    .title{
        color: white;
        font-size: 1.5em;
        text-align:center;
        width:100%;
    }

    .connecting-line{
        position:absolute;
        background-color:#003430;
        z-index: -1;
    }

    .middle-line{
        position:absolute;
        left:50%;
        top:100px;
        height:100%;
        width:5px;
        background-color:#003430;
        z-index: -1;
    }
    .roadmap-container{
        position: relative;
    }

    .can_afford > .roadmap-step-inner{
    }

    .roadmap-step{
        margin-bottom:65px;
        margin-top:15px;
        position:relative;
    }

    .locked.cannot_afford > .roadmap-step-inner{
        opacity: 0.1;
        pointer-events: none;
    }

    .locked.can_afford> .roadmap-step-inner{
        opacity: 0.5;
    }
    .locked.can_afford> .roadmap-step-inner:hover {
        opacity: 0.9;
    }

    .step-2, .step-4{
        top: 100px;
    }

    .step-1 > .connecting-line, .step-3 > .connecting-line{
        top : calc(50% - 5px);
        right:0;
        height:5px;
        width:30px;
    }
    .step-2 > .connecting-line, .step-4 > .connecting-line {
        top : calc(50% - 5px);
        right:calc(100% - 30px);
        height:5px;
        width:30px;
    }

    .btn-buy{
        width:100%;
        height:100%;
    }

    .cannot_afford .btn-buy{
        background-color:rgba(125,125,125,0.5);
        cursor: default;
    }
    .can_afford .btn-buy{
        background-color:rgba(0,147,196,0.5);
        cursor:pointer;
    }
    .can_afford .btn-buy:hover{
        background-color:rgba(0,177,193,0.5);
        cursor:pointer;
    }

    .btn:focus,.btn:active {
        outline: none !important;
        box-shadow: none;
    }

    .cols-same-height > [class*='col-'] {
        display: flex;
        flex-direction: column;
    }

    .line{
        height:2px;
        background-color: rgba(0,147,196,0.5);
        margin-top:5px;
        margin-bottom:10px;
    }

    p{
        margin-top:0.5px;
        margin-bottom:0.5px;
    }
</style>