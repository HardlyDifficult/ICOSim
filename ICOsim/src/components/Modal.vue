<template>
    <div class="mod-background" @click="visible=false" :style="visible ? '' : hidden">
        <div class="mod glow-1" onclick="event.stopPropagation();">
            <slot></slot>
        </div>
    </div>
</template>

<script>
  export default {
    name: "Modal",
    data(){
      return {
        hidden : {
          display:'none'
        },
        visible : false
      }
    },
    methods : {
      show(){
        this.visible = true;
      }
    }
  }
</script>

<style scoped>
    .mod-background{
        z-index:1000;
        position:fixed;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background-color:rgba(0,0,0,0.7);
        display:flex;
        align-items: center;
        justify-content: center;
    }

    .mod{
        background-color:rgba(0,0,0,1);
        display:inline-block;
        padding: 3em;
    }
</style>