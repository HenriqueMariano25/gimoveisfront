import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuesax from 'vuesax'
import { BootstrapVue,BootstrapVueIcons } from 'bootstrap-vue'
import VModal from 'vue-js-modal'
import VueTheMask from 'vue-the-mask'
import VueDayjs from 'vue-dayjs-plugin'
import VueCurrencyInput from 'vue-currency-input'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'vuesax/dist/vuesax.css'
import 'material-icons/iconfont/material-icons.css';

import store from "./services/store";
import vuetify from './plugins/vuetify'

import isMobile from "../../../GImoveis/gimoveis/src/mixin/isMobile";

Vue.use(Vuesax)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
Vue.use(VModal)
Vue.use(VueTheMask)
Vue.use(VueDayjs)
Vue.use(VueCurrencyInput)

Vue.mixin(isMobile)


Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
