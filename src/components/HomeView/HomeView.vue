<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>
        <v-progress-linear ref="progressBar" v-if="percentBar > -1" v-model="percentBar"></v-progress-linear>

        <v-layout row>
          <v-text-field v-model="newFile.yourName" label="Your name" single-line solo/>

          <v-text-field v-model="newFile.fileTitle" label="File title" single-line solo/>
          <v-btn round raised color="primary" dark @click="onPickFile">Upload</v-btn>
          <input type="file" style="display: none" ref="fileInput" @change="onFilePicked">
        </v-layout>

        <v-layout column>
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
                <v-list-tile-sub-title>Folder</v-list-tile-sub-title>
              </v-list-tile-content>
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
    this.getOurUsersRealTime();
  },
  computed: mapState(["currentItem"]),
  data() {
    return {
      file: null,
      ourUsers: [],
      newFile: {
        yourName: "",
        fileUrl: "0",
        fileTitle: "",
        fileName: "",
        fileSize: "0"
      },
      percentBar: -1
    };
  },
  methods: {
    ...mapMutations(["changeCurrentItem"]),

    navigate(item) {
      this.changeCurrentItem(item);
      this.$router.push(item);
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    getOurUsersRealTime() {
      firebaseInstance
        .firestore()
        .collection("users")
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(doc => {
            if (this.ourUsers.indexOf(doc.id) === -1) {
              this.ourUsers.push(doc.id);
            }
            this.ourUsers.sort();
          });
        });
    },
    onFilePicked(event) {
      // Upload file
      let browserFiles = event.target.files;

      if (browserFiles[0].name.lastIndexOf(".") <= 0) {
        return alert("Please add a valid file (No extension exception)");
      }

      this.file = browserFiles[0];

      this.newFile.fileName = this.file.name;

      let storageRef = firebaseInstance
        .storage()
        .ref("files/" + this.newFile.yourName);
      let uploadTask = storageRef.child(this.file.name).put(this.file);
      uploadTask.on(
        "state_changed",
        snapshot => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          let progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.percentBar = progress;
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        error => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;

            case "storage/canceled":
              // User canceled the upload
              break;

            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        () => {
          console.log("H");
          // Upload completed successfully, now we can get the download URL
          let getUrlAndSize = () => {
            console.log("RUNNING GETURLANDSIZE");
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log(
                "File available at" + downloadURL + "or " + this.newFile.fileUrl
              );
              this.newFile.fileUrl = downloadURL;
              this.updateDB();
            });
            uploadTask.snapshot.ref.getMetadata().then(metadata => {
              console.log(metadata.size);
              if (metadata.size < 1000) {
                this.newFile.fileSize = metadata.size + " B";
              } else if (metadata.size >= 1000 && metadata.size < 1000000) {
                this.newFile.fileSize = metadata.size / 1000 + " KiB";
              } else if (metadata.size >= 1000000) {
                this.newFile.fileSize = metadata.size / 1000000 + " MiB";
              }

              this.updateDB();
            });

            // if (this.newFile.fileSize != "0" && this.newFile.fileUrl != "0") {
            //   console.log("Updating db");
            //   this.updateDB();
            // } else {
            //   console.log("isnull");
            //   setTimeout(getUrlAndSize(), 250);
            // }
          };

          getUrlAndSize();
        }
      );
    },
    updateDB() {
      const usersRef = firebaseInstance
        .firestore()
        .doc("users/" + this.newFile.yourName);

      usersRef
        .get()
        .then(userDoc => {
          if (userDoc && userDoc.exists) {
            console.log("EXIST");
            usersRef
              .update({
                Files: firebaseInstance.firestore().FieldValue.arrayUnion({
                  yourName: this.newFile.yourName,
                  fileUrl: this.newFile.fileUrl,
                  fileTitle: this.newFile.fileTitle,
                  fileName: this.newFile.fileName,
                  fileSize: this.newFile.fileSize
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
                    yourName: this.newFile.yourName,
                    fileUrl: this.newFile.fileUrl,
                    fileTitle: this.newFile.fileTitle,
                    fileName: this.newFile.fileName,
                    fileSize: this.newFile.fileSize
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
