import Vue from 'vue'
import VueRouter from 'vue-router'
import AddCity from '../views/AddCity.vue'
import weather from '../views/weather.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'AddCity',
    component: AddCity
  },
  {
    path: '/weather/:city',
    name: 'weather',
    component: weather
  }
 
]

const router = new VueRouter({
  routes
})

export default router
