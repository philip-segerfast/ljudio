<script setup>
import { mapGetters, mapState } from "vuex";
import SearchMusicCard from "./SearchMusicCard.vue";
import SearchArtistCard from "./SearchArtistCard.vue";
import SearchAlbumCard from "./SearchAlbumCard.vue";
</script>

<script>
export default {
  methods: {
    show() {
      $("#search-results-container").fadeIn(500);
    },
    hide() {
      //$("#search-results-container").fadeOut(500);
    },
  },
  computed: {
    ...mapGetters(["getMusicSearch", "getAlbumSearch", "getArtistSearch"]),
  },
};
</script>

<template>
  <div id="search-results-container">
    <div class="result-category-row">
      <h2>Music</h2>
      <div class="results">
        <SearchMusicCard
          v-for="musicItem in getMusicSearch"
          :key="musicItem.videoId"
          :musicObject="musicItem"
        />
      </div>
    </div>
    <div class="result-category-row">
      <h2>Artists</h2>
      <div class="results">
        <SearchArtistCard
          v-for="artistItem in getArtistSearch"
          :key="artistItem.browseId"
          :artistObject="artistItem"
        />
      </div>
    </div>
    <div class="result-category-row">
      <h2>Albums</h2>
      <div class="results">
        <SearchAlbumCard
          v-for="albumItem in getAlbumSearch"
          :key="albumItem.browseId"
          :albumObject="albumItem"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#search-results-container {
  display: flex;
  flex-direction: column;
  // display: none; // default behaviour
  position: fixed; // position on top of everything else
  top: 80px;
  width: calc(100% - 60px);
  bottom: 30px;
  left: 30px;
  overflow-y: auto;
  padding: 10px;

  .result-category-row {
    height: fit-content;
    display: flex;
    margin-bottom: 10px;

    h2 {
      padding-top: 50px;
      text-align: right;
      width: 100px;
    }

    .results {
      width: 100%;
      display: flex;
      overflow-x: auto;
    }
  }
}
</style>
