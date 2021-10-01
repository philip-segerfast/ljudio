<script setup>
import SearchResults from "./SearchResults.vue";
import debounce from "../../scripts/debounce";
</script>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  data() {
    return {
      searchPhrase: "",
      fixRight: false,
    };
  },
  methods: {
    showSearchResults() {
      if (this.getCurrentRoute != "SearchView") {
        this.fixRight = false;
      }
      document.querySelector("#search-bar-container").classList.add("fix-top");
      this.$refs.searchResults.show();
    },

    hideSearchResults() {
      if (this.getCurrentRoute == "SearchView") {
        document.querySelector("#search-bar-container").classList.remove("fix-top");
      }
      this.$refs.searchResults.hide();
      this.fixRight = true;
    },

    updateSearchResults() {
      debounce(() => this.$store.dispatch("fetchSearchResults", this.searchPhrase));
    },
  },
  computed: {
    ...mapState(["header", "infoType"]),
    ...mapGetters(["getCurrentRoute", "shouldMoveSearchBar"]),
  },
};
</script>

<template>
  <SearchResults ref="searchResults" />
  <div
    id="search-bar-container"
    v-bind:class="{ 'fix-top': this.shouldMoveSearchBar, 'fix-right': this.fixRight }"
  >
    <div id="top-info">
      <span id="header">{{ this.header }}</span>
      <span id="info-type">{{ this.infoType }}</span>
    </div>
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
#top-info {
  display: inline-block;
  height: fit-content;
  margin-right: auto;

  span {
    display: block;
  }
}

.fix-top {
  top: 0 !important;
}

.fix-right {
  padding-right: 20px !important;
}

#search-bar-container {
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  padding-right: calc(50% - 15vw);
  width: 100%;
  top: calc(50% - 20px - 10px); // middle - input height / 2 - padding / 2
  transition: top 0.5s, padding 0.5s;

  input {
    position: relative;
    width: 30vw;
    height: 40px !important;
    border-radius: 25px;
    padding-left: 30px;
    font-size: x-large;
    transition: background-color 0.5s ease;
    background-color: #1b1b1b;
    outline: none;
    border: none;
    color: #7c7c7c;

    &:focus {
      background-color: #292929;
    }

    // top: calc(50% - 20px);
  }
}
</style>
