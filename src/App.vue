<template>
  <v-app>

    <v-toolbar
      app
      :clipped-left="clipped"
    >
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
import Firebase from "firebase";
import { config } from "./firebaseconf.js";

let app = Firebase.initializeApp(config);
let db = app.database();

let booksRef = db.ref("books");

export default {
  name: "App",
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Transfer"
    };
  }
};
</script>
