import Vue from 'vue'
import App from './App.vue'
import PrismicVue from 'prismic-vue'
import linkResolver from './link-resolver'
import router from './router'
 
// Add this before the new Vue instance
Vue.use(PrismicVue, {
  endpoint: window.prismic.endpoint,
  linkResolver
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
