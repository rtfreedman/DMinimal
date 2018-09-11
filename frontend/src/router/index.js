import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Tracker from '@/components/Tracker'

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
      name: 'Spell Tracker',
      component: Tracker
    }
  ]
})
