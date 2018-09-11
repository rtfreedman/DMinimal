import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import SpellTracker from '@/components/SpellTracker'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/spelltracker',
      name: 'SpellTracker',
      component: SpellTracker
    }
  ]
})
