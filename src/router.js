import Vue from "vue";
import Router from "vue-router";
import HomeView from "./components/HomeView/HomeView.vue";
import FolderView from "./components/HomeView/FolderView.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView
    },
    {
      path: "/:userName",
      name: "folderView",
      component: FolderView
    }
  ]
});
