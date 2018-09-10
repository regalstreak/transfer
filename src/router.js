import Vue from "vue";
import Router from "vue-router";
import HomeView from "./components/HomeView/HomeView.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    }
  ]
});
