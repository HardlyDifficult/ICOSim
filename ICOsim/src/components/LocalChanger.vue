<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale" v-on:change="onChange()">
      <option v-for="lang in langs" :value="lang" v-bind:key="lang">{{ lang }}</option>
    </select>
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
    onChange()
    {
      this.$localStorage.set('locale', this.$i18n.locale);
    }
  },
  mounted()
  {
    let locale = this.$localStorage.get('locale');
    if(!locale)
    {
      locale = "en";
    }

    this.$i18n.locale = locale;
  }
}
</script>