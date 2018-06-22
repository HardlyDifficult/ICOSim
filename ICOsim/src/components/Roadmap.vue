<template>
    <div class="row roadmap-container">
        <div class="col-sm-12">
            <h2>Roadmap</h2>
        </div>
        <div class="col-6 roadmap-step" v-for="(step, index) in steps" :key="index" :class="getStepClasses(step, index)">
            <div class="roadmap-step-inner" @mouseover="step.mouseover=true" :class="(step.next_price > player_money) ? 'glow-cant-afford' : 'glow-1'">

                <div class="row">

                    <div class="col-12">
                        <div class="title">{{step.title}}</div>
                    </div>

                    <div class="col-6">
                        <button class="btn btn-buy">BUY</button>
                    </div>
                    <div class="col-6">
                        <FundsContainer instant style="display:inline-block" :mystyle="{fontSize:'14px', backgroundColor:'transparent'}" :target="step.next_price"/>
                    </div>

                </div>
            </div>

            <div class="connecting-line" v-anime="line_animation"></div>
        </div>
        <div class="middle-line" :style="{height:(steps.length*100 - 55) + 'px'}"></div>

    </div>
</template>

<script>
  import FundsContainer from './FundsDisplay';

  export default {
    name: "Roadmap",

    components : {
      FundsContainer
    },

    methods : {
      getStepClasses(step, index){
        let classes = [];
        classes.push(this.classes[index % 4]);


        if(step.producing <= 0){
          classes.push('locked');
        }else{
          classes.push('unlocked');
        }

        if(step.next_price <= this.player_money){
          classes.push('can_afford');
        }else{
          classes.push('cannot_afford');
        }

        return classes;
      }
    },

    data (){
      return {
        line_animation: {

        } ,
        classes : [
          "step-1",
          "step-2",
          "step-3",
          "step-4"
        ],
        player_money : 75,
        steps : [
          {
            title : "Hire Intern",
            producing : 8,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(500)
          },
          {
            title : "Hire 2nd",
            producing : 8,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(25)
          },
          {
            title : "Hire 3rd",
            producing : 0,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(20)
          },
          {
            title : "Hire 4th",
            producing : 0,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(150)
          },
          {
            title : "Hire Intern",
            producing : 0,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(150)
          },
          {
            title : "Hire 2nd",
            producing : 0,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(150)
          },
          {
            title : "Hire 3rd",
            producing : 0,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(150)
          },
          {
            title : "Hire 4th",
            producing : 0,
            current_num : 80,
            expected_return : 1,
            next_price : new BigNumber(150)
          }
        ]
      };
    },

  }
</script>

<style scoped>

    .roadmap-step-inner{
        background-color:rgba(0,0,0,0.6);

        position:absolute;
        top : 30px;
        left: 30px;
        right: 30px;
        bottom: 30px;
        border-radius : 5px 5px 5px 5px;
    }

    .title{
        color: white;
        font-size: 1.5em;
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
        width:5px;
        background-color:#003430;
        z-index: -1;
    }

    .can_afford > .roadmap-step-inner{
    }

    .roadmap-step{
        position:relative;
        height: 200px;
    }

    .locked.cannot_afford > .roadmap-step-inner{
        opacity: 0.1;
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

    .cannot_afford .btn-buy{
        background-color:rgba(125,125,125,0.5);
        cursor: default;
    }
    .can_afford .btn-buy{
        background-color:rgba(0,147,196,0.5);
        cursor:pointer;
    }

    .btn:focus,.btn:active {
        outline: none !important;
        box-shadow: none;
    }
</style>