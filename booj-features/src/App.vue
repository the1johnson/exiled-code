<template>
  <div id="app">
    <HeaderComponent />
    <main>
      <router-view />
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import HeaderComponent from './components/header.vue'
import FooterComponent from './components/footer.vue'
export default {
  name: 'app',
  components: {
    HeaderComponent,
    FooterComponent
  }
}
</script>
