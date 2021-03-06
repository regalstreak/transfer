import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    currentItem: "sd"
  },
  mutations: {
    changeCurrentItem: (state, newItem) => {
      state.currentItem = newItem;
    }
  },
  actions: {}
});
