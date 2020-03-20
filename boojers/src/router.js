import Vue from 'vue'
import Router from 'vue-router'
import Homepage from '@/pages/home.vue'
import Events from '@/pages/events.vue'
import Bio from '@/pages/bio.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Homepage
    },
    {
      path: '/events',
      name: 'Event',
      component: Events
    },
    {
      path: '/bio/:bid',
      name: 'Bio',
      component: Bio,
      props: true,
    }
  ]
})