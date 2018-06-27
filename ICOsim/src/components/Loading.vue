<template>
    <div class="row">
        <div class="col-12">
            <h3>Loading - please wait while we're {{loadingString}}</h3>
        </div>
    </div>
</template>

<script>
  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  export default {
    name: "Loading",

    data() {
      return {
        strings : [
          'copy-pasting Whitepapers...',
          'inviting Shillers...',
          'creating our ERC20 token...',
          'moving to a tax haven...'
        ],
        current : 0,
        destroyed : false
      }
    },

    methods:{
      tick(){
        if(this.destroyed)
          return;

        this.current++;
        if(this.current >= this.strings.length)
          this.current = 0;
        setTimeout(this.tick, 2000);
      }
    },

    beforeDestroy(){
      this.destroyed = true
    },

    mounted(){
      this.strings = shuffle(this.strings);
      this.tick();
    },

    computed : {
      loadingString(){
        return this.strings[this.current]
      }
    }
  }
</script>

<style scoped>

</style>