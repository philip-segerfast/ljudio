<script setup>
import SearchBar from "../components/search/SearchBar.vue";
</script>

<script>
export default {
  methods: {
    play(id) {
      // calling global variable
      window.player.loadVideoById(id);
      window.player.playVideo();
    },

    pause() {
      window.player.pauseVideo();
    },
  },
};
</script>

<template>
  <div id="search-view-container">
    <SearchBar />
  </div>
</template>

<style scoped lang="scss">
#search-view-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  align-items: center;
}
</style>
