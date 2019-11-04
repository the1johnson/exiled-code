import Vue from 'vue'

import PrismicVue from 'prismic-vue'
import linkResolver from './link-resolver'

import 'fullpage.js/vendors/scrolloverflow'
// import './fullpage.scrollHorizontally.min'
import VueFullPage from 'vue-fullpage.js'

import App from './App.vue'

Vue.config.productionTip = false

Vue.use(PrismicVue, {
  endpoint: 'https://voltron.prismic.io/api/v2',
  linkResolver
})
Vue.use(VueFullPage)

new Vue({
  render: h => h(App)
}).$mount('#app')
