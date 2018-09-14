<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>

        <v-layout column >
            <v-list light>

                <v-list-tile
                    v-for="(item, index) in ourFiles"
                    :key="index"
                    avatar
                    @click="download(item)"
                >
                    <v-list-tile-avatar>
                    <v-icon class="blue white--text">folder</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                    <v-list-tile-sub-title>{{ item.size }}</v-list-tile-sub-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                    <v-btn icon ripple
                        @click="download">
                        <v-icon color="grey lighten-1">get_app</v-icon>
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
import { firestore } from "../../config/db.js";
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

    download(item) {
      if (item.url) {
        window.location = item.url;
      }
    },
    getOurDataRealTime() {
      firestore.doc("users/" + this.currentItem).onSnapshot(querySnapshot => {
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
