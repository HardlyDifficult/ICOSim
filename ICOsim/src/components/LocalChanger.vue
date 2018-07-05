<template>
  <div class="locale-changer">
    <span class="option" v-on:click="setLang('cn')" :class="$i18n.locale==='cn' ? 'active' : ''"><span class="flag-icon flag-icon-squared flag-icon-cn"></span>中文</span>
    <span class="option" v-on:click="setLang('en')" :class="$i18n.locale==='en' ? 'active' : ''"><span class="flag-icon flag-icon-squared flag-icon-us"></span>EN</span>
  </div>
</template>

<script>
export default {
  name: 'locale-changer',
  data () {
    return { 
      langs: ['en', 'cn'],

    }
  },
  methods:
  {
    setLang(lang){
      this.$i18n.locale = lang;
      this.$localStorage.set('locale', this.$i18n.locale);

    }
  }
}
</script>
<style>
small
{
  font-size:.75rem;
}

.option{
  cursor:pointer;
  padding:5px;
  background-color:rgba(0,188,209,0.05);
  border-radius:3px;
}

.active{
  background-color:rgba(0,188,209,0.5);
}
.flag-icon {
  background-size: contain;
  background-position: 50%;
  background-repeat: no-repeat;
  position: relative;
  display: inline-block;
  width: 1.33333333em;
  line-height: 1em;
  margin-right:3px;
}
.flag-icon:before {
  content: "\00a0";
}
.flag-icon.flag-icon-squared {
  width: 1em;
}
.flag-icon-cn.flag-icon-squared {
  background-image: url(../assets/flags/cn.svg);
}
.flag-icon-us.flag-icon-squared {
  background-image: url(../assets/flags/us.svg);
}
</style>