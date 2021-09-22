import { createStore } from "vuex";

import _ from "lodash";

export default createStore({
  state: {
    searchResults: {
      songs: [],
      albums: [],
      artists: [],
    },
    apiURL: "https://yt-music-api.herokuapp.com",
  },
  mutations: {
    updateMusicSearchResults: (state, payload) => (state.searchResults.songs = payload),
    updateArtistsSearchResults: (state, payload) => (state.searchResults.artists = payload),
    updateAlbumsSearchResults: (state, payload) => (state.searchResults.albums = payload),
  },
  actions: {
    fetchSearchResults: async (context, payload) => {
      context.dispatch("fetchMusicSearchResults", payload);
      context.dispatch("fetchAlbumsSearchResults", payload);
      context.dispatch("fetchArtistsSearchResults", payload);
    },
    fetchMusicSearchResults: async (context, payload) => {
      if (!payload) return;

      let url = context.state.apiURL + "/api/yt/songs/" + payload;
      let output;

      await fetch(url)
        .then((response) => response.json())
        .then((data) => (output = data));

      context.commit("updateMusicSearchResults", output.content);
    },
    fetchArtistsSearchResults: async (context, payload) => {
      if (!payload) return;

      let url = context.state.apiURL + "/api/yt/artists/" + payload;
      let output;

      await fetch(url)
        .then((response) => response.json())
        .then((data) => (output = data));

      context.commit("updateArtistsSearchResults", output.content);
    },
    fetchAlbumsSearchResults: async (context, payload) => {
      if (!payload) return;

      let url = context.state.apiURL + "/api/yt/search/" + payload;
      let output;

      await fetch(url)
        .then((response) => response.json())
        .then((data) => (output = data.content.filter((item) => item.type == "album")));

      context.commit("updateAlbumsSearchResults", output);
    },
  },
  getters: {
    getMusicSearch: (state) => {
      return state.searchResults.songs;
    },
    getAlbumSearch: (state) => {
      return state.searchResults.albums;
    },
    getArtistSearch: (state) => {
      return state.searchResults.artists;
    },
  },
});
