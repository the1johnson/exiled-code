<template>
  <div id="app">
    <div class="side-logo">
      <img src="@/assets/remax_logo_line.svg">
    </div>
    <HeaderComponent />
    <IntroComponent />
    <main>
      <router-view />
    </main>
  </div>
</template>

<script>
import IntroComponent from './components/intro.vue'
import HeaderComponent from './components/header.vue'
export default {
  name: 'app',
  components: {
    IntroComponent,
    HeaderComponent
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
  @import "@/styles/slice-support.scss";
  @import "@/styles/slice-crm.scss";
  @import "@/styles/footer.scss";
</style>