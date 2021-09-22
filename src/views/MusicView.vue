<script setup></script>

<script>
export default {
  data() {
    return {};
  },
  components: {},
  computed: {
    musicId() {
      return this.$route.params.id;
    },
  },
  mounted() {
    this.fetchSong();
  },
  methods: {
    fetchSong() {
      const url = "https://yt-music-api.herokuapp.com/api/yt/songs/" + this.musicId;
    },
  },
};
</script>

<template>
  <div id="music-view-container">
    <h1>Music ID: {{ musicId }}</h1>
  </div>
</template>

<style lang="scss" scoped>
music-view-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: fit-content 1fr;
}
</style>
