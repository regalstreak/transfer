<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>


        <v-layout row >
          <v-text-field 
            v-model="newFile.yourName"
            label="Your name"
            single-line
            solo
            />

          <v-text-field
            v-model="newFile.title"
            label="File title"
            single-line
            solo
            />
          <v-btn round raised color="primary" dark @click="onPickFile">Upload</v-btn>
          <input type="file" style="display: none" ref="fileInput" @change="onFilePicked" />
        </v-layout>

        <v-layout column >
            <v-list light>

                <v-list-tile
                    v-for="(item, index) in ourUsers"
                    :key="index"
                    avatar
                    @click="navigate(item)"
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
import { firestore, storage } from "../../config/db.js";
import firebase from "firebase";
import { mapState, mapMutations } from "vuex";

export default {
  created() {
    this.getOurDataRealTime();
  },
  computed: mapState(["currentItem"]),
  data() {
    return {
      file: " ",
      ourUsers: [],
      ourData: {},
      moddedData: [],
      newFile: {
        yourName: "",
        url: "",
        title: "",
        fileName: ""
      }
    };
  },
  methods: {
    ...mapMutations(["changeCurrentItem"]),

    navigate(item) {
      this.changeCurrentItem(item);
      console.log(this.currentItem);
      this.$router.push(item);
    },
    download() {
      window.location = "https://speed.hetzner.de/100MB.bin";
    },
    onPickFile() {
      this.$refs.fileInput.click();
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
    },
    onFilePicked(event) {
      let browserFiles = event.target.files;

      if (browserFiles[0].name.lastIndexOf(".") <= 0) {
        return alert("Please add a valid file (No extension exception)");
      }

      this.file = browserFiles[0];

      this.newFile.fileName = this.file.name;

      this.$refs.fileInput.addEventListener("change", () => {
        let storageRef = storage.ref(this.file.name);
        storageRef.put(this.file);
      });

      const usersRef = firestore.doc("users/" + this.newFile.yourName);

      usersRef
        .get()
        .then(userDoc => {
          if (userDoc && userDoc.exists) {
            console.log("EXIST");
            usersRef
              .update({
                Files: firebase.firestore.FieldValue.arrayUnion({
                  name: this.newFile.yourName,
                  url: this.newFile.url,
                  title: this.newFile.title,
                  fileName: this.newFile.fileName
                })
              })
              .then(() => {
                console.log("Status Updated");
              })
              .catch(error => {
                console.log("Got an error: " + error);
              });
          } else {
            console.log("NOT EXIST");
            usersRef
              .set({
                Files: [
                  {
                    name: this.newFile.yourName,
                    url: this.newFile.url,
                    title: this.newFile.title,
                    fileName: this.newFile.fileName
                  }
                ],
                name: this.newFile.yourName
              })
              .then(() => {
                console.log("Status Pushed");
              })
              .catch(error => {
                console.log("Got an error: " + error);
              });
          }
        })
        .catch(error => {
          console.log("ERROR IS: " + error);
        });

      alert("Pushed");

      this.getOurDataRealTime();
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
