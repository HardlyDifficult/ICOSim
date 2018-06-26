<template>
    <div class="row">
        <div class="col-sm-12">
            <h2>Team</h2>
        </div>
        <div class="team-container">
            <template v-for="(member, index) in items">
                <div v-if="member.bonus_multiplier !== null" class="team-member" :key="index" :class="getClasses(member)">
                    <div class="image" :style="{backgroundImage:'url(' + pictures[member.name]+ ')'}"></div>
                    <p class="member-name">{{member.name}}</p>
                    <p class="member-description">{{member.description}}</p>

                    <p v-if="parseInt(member.user_holdings) > 0" class="member-buy">ADVISOR LEVEL {{member.user_holdings}}</p>
                    <p v-else class="member-buy">BUY TO UNLOCK ADVISOR</p>

                    <p class="member-buy">$ {{getBuyPrice(member)}}</p>

                    <VueSlider
                            ref="slider"
                            v-model="member.number_to_buy"
                            :speed="0"
                            :min="0"
                            :max="parseInt(member.user_max_can_afford)"
                    ></VueSlider>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
  const game = require("../logic/game.js");
  import VueSlider from 'vue-slider-component';

  export default {
    name: "Team",

    components : {
      VueSlider
    },

    methods: {
      getClasses(member){
        let classes = [];
        if(!member.is_bought){
          if(member.price <= this.player_money){
            classes.push('not_bought_can_afford');
          }else{
            classes.push('not_bought_cannot_afford');
          }
        }else{
          classes.push('glow-1');
        }
        return classes;
      },

      getBuyPrice(item) {
        return game.getBuyPrice(item, item.number_to_buy);
      }

    },

    props : ['items'],

    data() {
      return {
        pictures : {
          'Roger Ver' : require('../assets/ver.png'),
          'John McAfee' : require('../assets/mcafee.png'),
          'Carlos Matos': require('../assets/matos.png'),
          'Tom Lee' : require('../assets/lee.png'),
          'Craig Grant': require('../assets/grant.png'),
          'Ian Balina': require('../assets/balina.png'),
          'Suppoman': require('../assets/suppoman.png'),
          'Trevon James': require('../assets/trevon.png'),
        },
        player_money : 75,
      };
    }
  }
</script>

<style scoped>
    .member-name{
        font-size:1.5em;
        padding:0;
    }
    .member-description{
        font-size:0.9em;
        padding:0;
    }
    .image{
        margin: 0 auto;
        margin-bottom:10px;
        height:150px;
        width:150px;
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
        border-radius: 250px;
        -webkit-filter: sepia(50%);
        filter: sepia(50%);
    }
    .team-container{
        position:relative;
        width:100%;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .team-member{
        padding:15px;
        background-color:rgba(0,0,0,0.5);
        margin:15px;
        width: 250px;
    }

    .not_bought_can_afford{
        opacity: 0.6;
        cursor:pointer;
    }
    .not_bought_can_afford:hover{
        opacity: 0.9;
    }

    .not_bought_cannot_afford{
        opacity: 0.3;
        -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
        filter: grayscale(100%);
    }

</style>