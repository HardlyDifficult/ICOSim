<template>
    <div class="notifications-container">
        <div v-for="(notification, index) in notifications" class="notification glow-1" v-bind:key="index" @click="removeNotification(index)">
            <p v-if="notification.title" class="title">{{notification.title}}</p>
            <p v-if="notification.message" class="message">{{notification.message}}</p>
            <a target="_blank" v-if="notification.href" :href="notification.href">{{notification.href_text}}</a>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Notifications",
    props : ['notifications'],
    data(){
      return {
        removed: false,
        interval : 100,
        default_time : 10000 //10 seconds

      }
    },
    methods : {
      removeNotification(index){
        this.notifications.splice(index, 1);
      },
      tick(){
        if(this.removed)
          return;

        for(let i = this.notifications.length -1;i>=0;i--){
          if(!this.notifications[i].count)
            this.notifications[i].count = 0;
          this.notifications[i].count++;

          if(this.notifications[i].count * this.interval > this.default_time)
            this.notifications.splice(i,1);
        }

        setTimeout(this.tick, this.interval);
      }
    },
    mounted : function(){
      this.tick();
    },
    destroyed : function(){
      this.removed = true;
    }

  }
</script>

<style scoped>
    @keyframes notification-slide{
        0%   {
            top:-155px;
        }
        100% {
            top:0;
        }
    }

    .title{
        font-size: 1.2em;
    }
    .message{
        font-size:0.9em;
    }

    .notifications-container{
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        z-index:125;
        pointer-events:none;
    }
    .notification{
        animation-name:notification-slide;
        animation-duration:1s;

        position:relative;
        left:5px;
        width:300px;
        height:150px;
        background-color:rgba(0,0,0,0.9);
        margin-top:5px;
        pointer-events:all;
    }
</style>