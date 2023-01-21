'use strict';

import Vue from 'vue';
import App from '@/App.vue';
import vuetify from './plugins/vuetify';

import { sync } from 'vuex-router-sync';
import router from '@/router';
import store from '@/store';
import VueTheMask from 'vue-the-mask';
import money from 'v-money';
import InstaladorMensagemFlutuante from '@Bimer/vue-mensagem-flutuante';
import Highcharts from "highcharts";
import HighchartsVue from 'highcharts-vue';
import AcessoDirective from "@/directives/acesso-directive";


import '@/static/styles/_index.scss';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.min.css';
import 'typeface-roboto/index.css';

Vue.config.productionTip = false;

Vue.use(VueTheMask);
Vue.use(new InstaladorMensagemFlutuante);
Vue.use(Highcharts);
Vue.use(HighchartsVue);
Vue.use(money, {precision: 2}); 

Vue.directive('acesso', AcessoDirective);

sync(store, router);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
