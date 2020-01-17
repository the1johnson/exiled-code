import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'
import router from './router/index.js'

Vue.config.productionTip = false
Vue.use(BootstrapVue, VueAxios, axios)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

import './custom.scss'
