import Vue from 'vue'
import Router from 'vue-router'
import TrackerList from '@/components/TrackerList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'DMinimal',
      component: TrackerList
    }
  ]
})
