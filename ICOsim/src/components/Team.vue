<template>
    <div class="row">
        <div class="col-sm-12">
            <h2>Team</h2>
        </div>
        <div class="team-container">
            <div class="team-member glow-1" v-for="(member, index) in members" v-bind:key="index">
                <div class="image" :style="{backgroundImage:'url(' + member.img + ')'}"></div>
                <p class="member-name">{{member.name}}</p>
                <p class="member-description">{{member.description}}</p>
            </div>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Team",
    data() {
      return {
        members: [
          {
            name: "John McAfee",
            description: "Full time paid shiller",
            img: require('../assets/mcafee.png')
          },
          {
            name: "John McAfee",
            description: "Full time paid shiller",
            img: require('../assets/mcafee.png')
          },
          {
            name: "John McAfee",
            description: "Full time paid shiller",
            img: require('../assets/mcafee.png')
          },
          {
            name: "John McAfee",
            description: "Full time paid shiller",
            img: require('../assets/mcafee.png')
          },
          {
            name: "John McAfee",
            description: "Full time paid shiller",
            img: require('../assets/mcafee.png')
          },
          {
            name: "John McAfee",
            description: "Full time paid shiller",
            img: require('../assets/mcafee.png')
          }
        ]
      };
    }
  }
</script>

<style scoped>
    .member-name{
        text-align:left;
        font-size:1.5em;
        padding:0;
    }
    .member-description{
        font-size:0.9em;
        text-align: left;
        padding:0;
    }
    .image{
        margin: 0 auto;
        margin-bottom:10px;
        background-color:red;
        height:150px;
        width:150px;
        background-size:cover;
        background-position:center;
        background-repeat:no-repeat;
        border-radius: 250px;
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

</style>