<script setup></script>

<script>
export default {
  data() {
    return {
      thumbnailUrl: "/src/assets/song_placeholder.bmp",
    };
  },
  props: ["musicObject"],
  components: {},
  methods: {
    redirectMusic() {
      let videoID = this.musicObject.videoId;
      this.$router.push({ name: "MusicView", params: { id: videoID, fromSearch: true } });
    },
  },
  mounted() {
    let thumbnails = this.musicObject.thumbnails;

    let thumbnailToUse;
    if (thumbnails[1]) {
      thumbnailToUse = thumbnails[1].url;
    }
    this.thumbnailUrl = thumbnailToUse;
  },
};
</script>

<template>
  <div id="search-music-card-container" @click="redirectMusic">
    <div id="top">
      <img
        id="cover"
        :src="thumbnailUrl"
        referrerpolicy="no-referrer"
        @error="console.log('Error')"
      />
    </div>
    <div id="bottom">
      <abbr :title="musicObject.name">{{ musicObject.name }}</abbr>
      <abbr :title="musicObject.artist.name">{{ musicObject.artist.name }}</abbr>
    </div>
  </div>
</template>

<style lang="scss" scoped>
abbr {
  text-decoration: none;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

#search-music-card-container {
  display: flex;
  flex-direction: column;
  margin-right: 10px;
  height: 200px;
  max-height: 200px;
  width: 120px;
  min-width: 120px;
  text-overflow: ellipsis;
  cursor: pointer;

  &:first-child {
    margin-left: 10px;
  }

  #top {
    display: flex;
    justify-content: center;
    height: 75%;
  }

  #bottom {
    padding-top: 5px;
    height: 25%;
    width: 100px;
    font-size: small;
  }
}
</style>
