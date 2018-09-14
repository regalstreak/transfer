<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>

        <v-layout column >
            <v-list light>

                <v-list-tile
                    v-for="(item, index) in ourUsers"
                    :key="index"
                    avatar
                    @click="download"
                >
                    <v-list-tile-avatar>
                    <v-icon class="blue white--text">folder</v-icon>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                    <v-list-tile-title>{{ item }}</v-list-tile-title>
                    <v-list-tile-sub-title>10 KiB</v-list-tile-sub-title>
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
import { mapState } from "vuex";

export default {
  created() {
    this.getOurDataRealTime();
  },
  computed: mapState(["currentItem"]),
  data() {
    return {
      ourUsers: [],
      ourData: {}
    };
  },
  methods: {
    download() {
      window.location = "https://speed.hetzner.de/100MB.bin";
    },
    getOurDataRealTime() {
      firestore.collection("users").onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (this.ourUsers.indexOf(doc.id) === -1) {
            this.ourUsers.push(doc.id);
          }
          this.ourUsers.sort();
        });
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
