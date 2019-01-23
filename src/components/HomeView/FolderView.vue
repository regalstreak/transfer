<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        <v-layout column>
          <v-list light>
            <v-list-tile
              v-for="(item, index) in ourFiles"
              :key="index"
              avatar
              @click="download(item)"
              v-if="item.fileSize != 0 && item.fileUrl != ''"
            >
              <v-list-tile-avatar>
                <v-icon class="blue white--text">assignment</v-icon>
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>{{ item.fileName }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ item.fileSize }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-btn icon ripple @click="info(item)">
                  <v-icon color="grey lighten-1">info</v-icon>
                </v-btn>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </v-layout>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import "firebase/firestore";
import "firebase/storage";
import firebaseInstance from "../../config/db.js";
import { mapState, mapMutations } from "vuex";

export default {
  created() {
    this.getOurDataRealTime();
    this.changeCurrentItem(document.location.href.split("/").pop());
  },
  computed: mapState(["currentItem"]),
  data() {
    return {
      ourFiles: []
    };
  },
  methods: {
    ...mapMutations(["changeCurrentItem"]),

    info(item) {
      console.log(item.fileSize);
    },
    download(item) {
      if (item.fileUrl) {
        window.location = item.fileUrl;
      }
    },
    getOurDataRealTime() {
      firebaseInstance
        .firestore()
        .doc("users/" + this.currentItem)
        .onSnapshot(querySnapshot => {
          if (querySnapshot.exists) {
            this.ourFiles = querySnapshot.data().Files;
            console.log(this.ourFiles);
            console.log("Document data:", querySnapshot.data());
          } else {
            console.log("No such document!");
          }
        });
    }
  }
};
</script>


<style scoped>
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
