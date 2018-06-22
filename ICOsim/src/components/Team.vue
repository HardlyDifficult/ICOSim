<template>
    <div class="row">
        <div class="col-sm-12">
            <h2>Team</h2>
        </div>
        <div class="team-container">
            <div class="team-member" v-for="(member, index) in members" :key="index" :class="getClasses(member)">
                <div class="image" :style="{backgroundImage:'url(' + member.img + ')'}"></div>
                <p class="member-name">{{member.name}}</p>
                <p class="member-description">{{member.description}}</p>

                <p v-if="member.is_bought" class="member-buy">Active Advisor!</p>
                <p v-else-if="member.price <= player_money" class="member-buy">Buy For: $ {{member.price}}</p>
                <p v-else class="member-buy">$ {{member.price}}</p>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Team",

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
      }
    },

    data() {
      return {
        player_money : 75,
        members: [
          {
            name: "Tom Lee",
            description: "Full time paid shiller",
            img: require('../assets/lee.png'),
            is_bought : true,
            price : 5
          },
          {
            name: "Craig Grant",
            description: "Full time paid shiller",
            img: require('../assets/grant.png'),
            is_bought : true,
            price : 5
          },
          {
            name: "Ian Balina",
            description: "Full time paid shiller",
            img: require('../assets/balina.png'),
            is_bought : false,
            price : 5
          },
          {
            name: "Suppoman",
            description: "Full time paid shiller",
            img: require('../assets/suppoman.png'),
            is_bought : false,
            price : 500
          },
          {
            name: "Trevon James",
            description: "Full time paid shiller",
            img: require('../assets/trevon.png'),
            is_bought : false,
            price : 500
          },
          {
            name: "Roger Ver",
            description: "Full time paid shiller",
            img: require('../assets/ver.png'),
            is_bought : false,
            price : 500
          },
          {
            name: "John McAfee",
            description: "Full time paid shiller",
            img: require('../assets/mcafee.png'),
            is_bought : false,
            price : 500
          },
          {
            name: "Carlos Matos",
            description: "Full time paid shiller",
            img: require('../assets/matos.png'),
            is_bought : false,
            price : 500
          }

        ]
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
        width: 200px;
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