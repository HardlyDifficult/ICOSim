import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home'
import Dashboard from '@/components/Dashboard'
import Debug from '@/components/Debug'
import CMC from '@/components/CMC'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/faq',
      name: 'FAQ',
      redirect: to => document.location.href='https://docs.google.com/document/d/19qHsQBc6bNHq-GNTpy4KgA4UwdnmPWQxpJSRszAkVBI/edit?usp=sharing',
    },
    {
      path: '/ico/:ticker',
      name: 'ico',
      component: Home
    },
    {
      path: '/debug',
      name: 'Debug',
      component: Debug
    },
    {
      path: '/icos',
      name: 'ICOs',
      component: CMC
    },
  ]
})
