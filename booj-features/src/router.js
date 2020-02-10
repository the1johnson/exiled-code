import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/components/homepage.vue'
import Tour from '@/components/tour.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Homepage
    },
    {
      path: '/tour/:tid',
      name: 'Tour',
      component: Tour,
      props: true 
    }
  ]
})