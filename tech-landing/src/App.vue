<template>
  <div id="app">
    <header-component />
    <main>
      <router-view />
    </main>
    <footer-component />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HeaderComponent from './components/header.vue';
import FooterComponent from './components/footer.vue';

@Component({
  components: {
    HeaderComponent,
    FooterComponent,
  },
})
export default class App extends Vue {}
</script>
