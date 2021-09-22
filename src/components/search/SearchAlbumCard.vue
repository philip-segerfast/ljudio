<script setup></script>

<script>
export default {
  data() {
    return {
      thumbnailUrl: "/src/assets/song_placeholder.bmp",
    };
  },
  props: ["albumObject"],
  components: {},
  methods: {},
  mounted() {
    let thumbnails = this.albumObject.thumbnails;

    let thumbnailToUse;
    if (thumbnails[1]) {
      thumbnailToUse = thumbnails[1].url;
    }
    this.thumbnailUrl = thumbnailToUse;
  },
};
</script>

<template>
  <div id="search-album-card-container">
    <div id="top">
      <img id="cover" :src="thumbnailUrl" />
    </div>
    <div id="bottom">
      <abbr :title="albumObject.name">{{ albumObject.name }}</abbr>
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

#search-album-card-container {
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
