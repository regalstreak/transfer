<template>
  <v-app>

    <v-toolbar
      app
      :clipped-left="clipped"
    >
      <v-toolbar-side-icon v-if="isHome == false" @click="back">
        <v-icon dark>chevron_left</v-icon>
      </v-toolbar-side-icon>
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>Made with ❤️ by Neil Agarwal</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  name: "App",
  created() {
    this.checkHome();
  },
  computed: mapState(["currentItem"]),
  data() {
    return {
      isHome: false,
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Transfer"
    };
  },
  methods: {
    ...mapMutations(["changeCurrentItem"]),
    back() {
      window.history.back();
    },
    checkHome() {
      if (!document.location.href.split("/").pop()) {
        this.isHome = true;
        this.changeCurrentItem("");
      } else {
        this.isHome = false;
      }
    }
  },
  watch: {
    $route: function() {
      this.checkHome();
    }
  }
};
</script>
