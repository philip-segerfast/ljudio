<script setup></script>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

export default {
  data() {
    return {};
  },
  components: {},
  methods: {
    // ...mapActions(["playSong", "pauseSong", "playNextSong", "playPreviousSong"]),
  },
  computed: {
    // ...mapGetters(["YTPlayerInitialized", "buffering", "cued", "readyToPlay", "playing"]),
    ...mapState(["playerReady"]),
  },
};
</script>

<template>
  <div style="position: fixed; z-index: 1000" v-if="playerReady">PLAYER IS READY!</div>
  <div id="music-controller-container">
    <!-- <div v-if="readyToPlay">
      <button @click="playPreviousSong" class="control-button">&#60;</button>
      <button @click="playSong" class="control-button">play</button>
      <button @click="pauseSong" class="control-button">pause</button>
      <button @click="playNextSong" class="control-button">&#62;</button>
    </div>
    <div v-else id="player-loading">
      <span v-if="!YTPlayerInitialized">player initializing...</span>
      <span v-else-if="buffering">buffering...</span>
      <span v-else-if="!cued || !playing">no song cued</span>
    </div> -->
  </div>
</template>

<style lang="scss" scoped>
#music-controller-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-top: auto;
  .control-button {
    height: min-content;
    padding: 5px;
  }

  #player-loading {
    background-color: red;
  }
}
</style>
