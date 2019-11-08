<template>
  <div id="app">
    <prismic-slides></prismic-slides>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import PrismicSlides from './components/prismic-slides.vue';

@Component({
  components: {
    PrismicSlides,
  },
})
export default class App extends Vue {}
</script>
