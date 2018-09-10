<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column>

        <div >
            <v-btn round color="primary" dark>Upload</v-btn>
        </div>

        <space></space>

        <div>
            <v-list light>

                <v-list-tile
                    v-for="item in files"
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
        </div>
        

      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      files: [
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
