<script setup>
import SearchResults from "./SearchResults.vue";
import debounce from "../../scripts/debounce";
</script>

<script>
export default {
  data() {
    return {
      searchPhrase: "",
    };
  },
  methods: {
    showSearchResults() {
      this.$refs.searchResults.show();
    },

    hideSearchResults() {
      this.$refs.searchResults.hide();
    },

    updateSearchResults() {
      debounce(() => this.$store.dispatch("fetchSearchResults", this.searchPhrase));
    },
  },
};
</script>

<template>
  <div id="search-bar-container">
    <SearchResults ref="searchResults" />
    <input
      id="search-bar"
      type="text"
      placeholder="Enter song, artist, album"
      v-model="searchPhrase"
      @focus="showSearchResults"
      @blur="hideSearchResults"
      @input="updateSearchResults"
    />
  </div>
</template>

<style scoped lang="scss">
#search-bar-container {
  height: 100%;

  .fix-top {
    top: 20px;
  }

  input {
    @extend .fix-top;
    position: relative;
    width: 30vw;
    height: 40px;
    border-radius: 25px;
    padding-left: 10px;
    font-size: x-large;
    transition: top 0.5s, background-color 0.5s ease;
    background-color: #1b1b1b;
    outline: none;
    border: none;
    color: #7c7c7c;

    // top: calc(50% - 20px);
  }

  input:focus {
    @extend .fix-top;
    background-color: #292929;
  }
}
</style>
