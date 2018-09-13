<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>

        <v-layout row >
          <v-btn round raised color="primary" dark @click="uploadFile">Upload</v-btn>
          <input type="file" style="display: none" ref="fileInput" @change="onFilePicked" />
        </v-layout>

        <space></space>

        <v-layout column>
            <v-list light>

                <v-list-tile
                    v-for="item in testFiles"
                    :key="item.title"
                    avatar
                    @click="download"
                >
                    <v-list-tile-avatar>
                    <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
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
import { db } from "../../config/db.js";
export default {
  // firebase: {
  //   fileRef: db.ref("uploadedFiles")
  // },
  data() {
    return {
      file: null,
      newFile: {
        url: "",
        title: ""
      },
      testFiles: [
        {
          icon: "assignment",
          iconClass: "blue white--text",
          title: "Vacation itinerary",
          size: "5kb"
        },
        {
          icon: "call_to_action",
          iconClass: "amber white--text",
          title: "Kitchen remodel",
          size: "10kb"
        }
      ]
    };
  },
  methods: {
    download() {
      window.location = "https://speed.hetzner.de/100MB.bin";
    },
    onPickFile() {
      this.$refs.fileInput.click();
    },
    onFilePicked(event) {
      const browserFiles = event.target.files;
      let filename = browserFiles[0].name;
      if (filename.lastIndexOf(".") <= 0) {
        return alert("Please add a valid file (No extension exception)");
      }
      // const fileReader = new FileReader();
      // fileReader.addEventListener("load", () => {
      //   this.fileUrl = fileReader.result;
      // });
      // fileReader.readAsDataURL(files[0]);

      this.file = browserFiles[0];
    },
    uploadFile() {
      // if (!this.file) {
      //   return;
      // }
      let filesRef = db.ref("uploadedFiles");
      filesRef.push({
        url: "testurl",
        title: "Testtitle"
      });
      alert("Pushed");
    }
  }
};
</script>


<style scoped>
h1,
h2 {
  font-weight: normal;
}
space {
  margin-top: 20px;
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
