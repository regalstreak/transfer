import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// import "./registerServiceWorker";
import VueFire from "vuefire";

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

Vue.use(VueFire);
