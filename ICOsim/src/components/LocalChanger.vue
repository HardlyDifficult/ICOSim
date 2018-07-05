<template>
  <div class="locale-changer">
    <select v-model="$i18n.locale" v-on:change="onChange()">
      <option v-for="lang in langs" :value="lang" v-bind:key="lang">{{ lang }}</option>
    </select>
    <small class="row" v-if="$i18n.locale=='cn'">
      请通过建议<a target="_blank" class="highlight underline" href="https://discord.gg/2bsDfkv">Discord</a>的改进来帮助改进翻译。
    </small>
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
  }
}
</script>
<style>
small
{
  font-size:.75rem;
}
</style>