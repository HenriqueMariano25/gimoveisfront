import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import Vuesax from 'vuesax'
import { BootstrapVue,BootstrapVueIcons } from 'bootstrap-vue'
import VModal from 'vue-js-modal'
import VueTheMask from 'vue-the-mask'
import VueDayjs from 'vue-dayjs-plugin'
import VueCurrencyInput from 'vue-currency-input'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';

import store from "./services/store";

import isMobile from "./mixin/isMobile";
import converterDinheiroFloat from "./mixin/converterDinheiroFloat";
import buscarEndereco from "./mixin/buscarEndereco";
import paraTopo from './mixin/paraTopo'


Vue.use(Vuesax)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VModal)
Vue.use(VueTheMask)
Vue.use(VueDayjs)
Vue.use(VueCurrencyInput)

Vue.mixin(isMobile)
Vue.mixin(converterDinheiroFloat)
Vue.mixin(buscarEndereco)
Vue.mixin(paraTopo)

Vue.config.productionTip = false
import "./css/global.css"

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
