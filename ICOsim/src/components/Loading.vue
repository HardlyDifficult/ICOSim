<template>
    <div class="row">
        <div class="col-12">
            <h3>Loading - please wait while we're {{loadingString}}{{ellipse}}</h3>
        </div>
    </div>
</template>

<script>
let tick_count = 0;

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
          'copy-pasting Whitepapers',
          'inviting Shillers',
          'creating our ERC20 token',
          'moving to a tax haven'
        ],
        current : 0,
        destroyed : false,
        ellipse: ""
      }
    },

    methods:{
      tick(){
        if(this.destroyed)
        {
          return;
        }
        tick_count++;
        this.ellipse = "";
        let dot_count = tick_count % 4;
        for(let i = 0; i < dot_count; i++)
        {
          this.ellipse += ".";
        }

        if(tick_count % 10 == 0)
        {
          tick_count = 0;
          this.current++;
          if(this.current >= this.strings.length)
          {
            this.current = 0;
          }
        }
        setTimeout(this.tick, 500);
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