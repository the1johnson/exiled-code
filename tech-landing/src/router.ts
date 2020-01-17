import VueRouter, { RouteConfig, Route } from 'vue-router';
import Homepage from './components/homepage.vue';
import SectionTour from './components/section-tour.vue';

export const routerData: RouteConfig[] = [
  {
    path: '/',
    component: Homepage,
  },
  {
    path: '/tour',
    component: SectionTour,
  },
];
export default new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  linkExactActiveClass: 'active',
  routes: routerData,
});
