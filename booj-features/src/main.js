import Vue from 'vue'
import App from './App.vue'
import PrismicVue from 'prismic-vue'
import linkResolver from './link-resolver'
import router from './router'
import VueFullPage from 'vue-fullpage.js'
import 'fullpage.js/dist/fullpage.css'
 
// Add this before the new Vue instance
Vue.use(PrismicVue, {
  endpoint: window.prismic.endpoint,
  linkResolver
})
Vue.use(VueFullPage);


Vue.config.productionTip = false

export const eBus = new Vue();
new Vue({
  render: h => h(App),
  router
}).$mount('#app')

