<template>
    <div class="particles-container" @click="testAddParticle">

        <div v-for="particle in particles" v-bind:key="particle.particleId" :style="particle.style" class="particle" :class="particle.classes">
            <div class="particle-inner">
                {{particle.text}}
            </div>
        </div>

    </div>
</template>

<script>

  export default {
    name: "Particles",
    data () {
      return {
        running : true,
        interval : 20,
        currentParticleId: 0,
        particles : []
      }
    },

    methods: {
      tick(){
        if(!this.running)
          return;

        //remove particles
        for(let i = this.particles.length -1;i>=0;i--){
          this.particles[i].life += this.interval;
          let particle = this.particles[i];
          if(particle.life >= particle.maxLife){
            this.particles.splice(i,1);
          }else{
            console.log(`time left: ${particle.life} ${particle.maxLife}`);
          }

        }

        setTimeout(this.tick, this.interval);
      },

      addSpawner(text, position, rate){

      },

      addParticle(text, left, right){
        this.particles.push({
          text : text,
          particleId : this.currentParticleId++,
          left : left,
          right : right,
          life : 0,
          maxLife : 2000,
          style : {
            position : 'absolute',
            left : left + 'px',
            top : right + 'px',
            fontSize: (Math.random()*200) + 'px'
          },
          classes : [
            (Math.random() < 0.5) ? 'left-to-right' : 'right-to-left'
          ]
        });
      },

      testAddParticle(){
        this.addParticle("$", 50,50);
      }

    },

    mounted(){
      this.tick();
    },

    beforeDestroy(){
      this.running = false;
    }
  }
</script>

<style scoped>
    .particles-container{
        position:absolute;
        top:0;
        height:100%;
        left:0;
        right:0;
        z-index:1000;
    }
    .particle-inner{
        font-size:20px;
    }

    .particle{
    }

    .left-to-right{
        animation: particle-drop 2s linear, particle-movement-left-to-right 2s linear;
        animation-fill-mode: forwards;

    }
    .right-to-left{
        animation: particle-drop 2s linear, particle-movement-right-to-left 2s linear;
        animation-fill-mode: forwards;
    }

    @keyframes particle-movement-left-to-right{
        0%   {
            margin-left:0;
        }
        100%  {
            margin-left:5em;
        }
    }
    @keyframes particle-movement-right-to-left{
        0%   {
            margin-left:0;
        }
        100%  {
            margin-left:-5em;
        }
    }
    @keyframes particle-drop{
        0%   {
            margin-top:0;
            opacity: 1;
        }
        100%  {
            margin-top:100%;
            opacity: 0;
        }
    }

</style>