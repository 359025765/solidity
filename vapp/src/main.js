import Vue from 'vue';
import App from './App.vue';
import Vuex from 'vuex';
import { store } from './store/';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(ElementUI);

new Vue({
    render: h => h(App),
    // router,
    store,
    el: '#app',
    components: { App },
    template: '<App/>'
}).$mount('#app');