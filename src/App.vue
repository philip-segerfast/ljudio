<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import SearchComponent from "./components/search/SearchComponent.vue";
import MusicController from "./components/MusicController.vue";
import { mapGetters } from "vuex";
import YTPlayer from "./components/YTPlayer.vue";
</script>

<script>
export default {
  data: function () {
    return {};
  },
  methods: {},
  watch: {
    // Update current route in vuex store
    $route(to) {
      this.$store.commit("updateRoute", to.name);
    },
  },
  computed: {
    ...mapGetters(["getCurrentRoute"]),
    shouldShowMusicController() {
      return this.getCurrentRoute != "SearchView";
    },
  },
};
</script>

<template>
  <!-- imported script needed to use the YouTube Player -->
  <!-- <div id="player"></div> -->
  <SearchComponent />
  <router-view />
  <YTPlayer />
  <!-- <MusicController v-if="shouldShowMusicController" /> -->
</template>

<style lang="scss">
@use "./style.css";

#app {
  position: relative;
  display: grid;
  grid-template-rows: min-content 1fr min-content;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}
</style>
