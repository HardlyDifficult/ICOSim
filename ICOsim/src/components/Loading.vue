<template>
    <div class="row">
        <div class="col-12">
            <h3>{{loadingString}}
              <span class="ellipse">{{ellipse}}</span>
            </h3>
            <br>
            <h5 v-if="been_a_minute">({{ $t("loading.be_patient") }})</h5>
            
            <br>
            <h5 v-if="been_a_while">{{ $t("loading.wow") }}</h5>
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
        strings: null,
        current : 0,
        destroyed : false,
        ellipse: "",
        been_a_minute: false,
        been_a_while: false,
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
          this.been_a_minute = true;
        }
        if(tick_count % 15 == 0)
        {
          this.been_a_while = true;
        }

        if(tick_count >= 20)
        {
          location.reload();
          return;
        }

        if(tick_count % 10 == 0)
        {
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
    created()
    {
      this.strings = shuffle(this.$t("loading.strings"));
    },
    mounted()
    {
      this.tick();
    },

    computed : {
      loadingString()
      {
        return this.strings[this.current]
      }
    }
  }
</script>

<style scoped>
.ellipse
{
  position:absolute;
}
</style>