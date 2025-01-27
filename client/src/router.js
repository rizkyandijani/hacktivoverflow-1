import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import profile from './components/profile'
import detailPage from './views/detailPage'
Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      children : [
        {
          path : 'myProfile',
          name : 'profile',
          component : profile
        }
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue')
    },
    {
      path: '/detail/:questionId',
      name : 'detailPage',
      component : detailPage
    }
  ]
})
