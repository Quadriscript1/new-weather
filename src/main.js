import Vue from 'vue'
import App from './App.vue'
import router from './router'
import VueElementLoading from "vue-element-loading";
Vue.component("VueElementLoading", VueElementLoading)
import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";
Vue.config.productionTip = false
const options = {
  pauseOnHover: true,
};
Vue.use(Toast, options);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
