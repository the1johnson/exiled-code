<template>
  <div id="app">
    <HeaderComponent />
    <IntroComponent />
    <main>
      <router-view />
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import IntroComponent from './components/intro.vue'
import HeaderComponent from './components/header.vue'
import FooterComponent from './components/footer.vue'
export default {
  name: 'app',
  components: {
    IntroComponent,
    HeaderComponent,
    FooterComponent
  }
}
</script>
<style lang="scss">
  @import "@/styles/reset.scss";
  @import "@/styles/header.scss";
  @import "@/styles/intro.scss";
  @import "@/styles/base.scss";
  @import "@/styles/slice-simple.scss";
  @import "@/styles/slice-list.scss";
  @import "@/styles/slice-app.scss";
</style>