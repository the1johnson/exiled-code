import Vue from 'vue'
import PrismicVue from 'prismic-vue'
import linkResolver from './prismic/link-resolver'
import htmlSerializer from './prismic/html-serializer'
import App from './App.vue'

Vue.config.productionTip = false

Vue.use(PrismicVue, {
  endpoint: 'https://voltron.prismic.io/api/v2',
  linkResolver,
  htmlSerializer
})

new Vue({
  render: h => h(App)
}).$mount('#app')
