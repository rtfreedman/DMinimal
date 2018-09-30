import Vue from 'vue'
import Router from 'vue-router'
import Tracker from '@/components/Tracker'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DMTracker',
      component: Tracker
    }
  ]
})
