export default {
  state: {
    playerState: null,
    isPlayerReady: false,
    playlist: null,
    // playlistSongIndex: -1, // necessary?
    currentSongObj: {},
    currentSongID: "",
    currentAlbumObj: {},
    currentAlbumID: "",
    currentSongIndex: 0,
  },
  mutations: {
    updatePlayerState: (state, newPlayerState) => {
      console.log("updatePlayerState: ", newPlayerState);
      state.playerState = newPlayerState;
    },
    setPlayerReady: (state, isPlayerReady) => {
      state.isPlayerReady = isPlayerReady;
    },
    setPlayerState: (state, newState) => {
      state.playerState = newState;
    },
    setPlaylist: (state, payload) => {
      state.playlist = payload;
    },
    clearPlaylist: (state) => {
      state.playlist = null;
      state.playlistSongIndex = -1;
      currentSong = "";
    },
    _setCurrentSongObj: (state, payload) => {
      state.currentSongObj = payload;
    },
    _setCurrentSongID: (state, payload) => {
      state.currentSongID = payload;
    },
    _setCurrentAlbumObj: (state, payload) => {
      state.currentAlbumObj = payload;
    },
    _setCurrentAlbumID: (state, payload) => {
      state.currentAlbumID = payload;
    },
    _setCurrentSongIndex: (state, payload) => {
      state.currentSongIndex = payload;
    },
    resetPlayerState: (state, payload) => {
      state.currentSongObj = {};
      state.currentSongID = "";
      state.currentAlbumID = "";
      state.currentAlbumObj = null;
      state.currentSongIndex = 0;
    },
  },
  actions: {
    updateCurrentSong: async ({ dispatch, commit, getters }, { songId, index }) => {
      console.log("SONG ID: ", songId, "(får vara undefined)");
      console.log("INDEX: ", index, "(får vara undefined)");

      console.log("UPDATE CURRENT SONG");

      if (songId && index) {
        console.error("You cannot update current song by passing both songId and index.");
      }

      if (songId) {
        // Används av MusicView
        commit("_setCurrentSongID", songId);
        await dispatch("_fetchCurrentSong");
      } else if (index) {
        let _songId = getters.getPlaylist[index];
        commit("_setCurrentSongID", _songId);
        commit("_setCurrentSongIndex", index);
        await dispatch("_fetchCurrentSong");
        console.log("Current song: ", getters.getCurrentSongObj);
      }
    },
    updateCurrentAlbumAndFetchPlaylist: async (
      { dispatch, commit },
      { albumId, songIndex = 0 }
    ) => {
      commit("_setCurrentAlbumID", albumId);
      await dispatch("_fetchCurrentAlbum");
      await dispatch("_fetchAlbumPlaylist");
      await dispatch("updateCurrentSong", { index: songIndex });
    },
    _fetchCurrentSong: async ({ state, rootState, getters, commit }) => {
      let videoID = getters.getCurrentSongID;

      const songFetchUrl = rootState.apiURL + "/api/yt/songs/" + videoID; // bra
      let songMatch;

      await fetch(songFetchUrl)
        .then((response) => response.json())
        .then((data) => (songMatch = data.content[0])); // data contains an array "content", containing one item.

      if (!songMatch) {
        alert("This song is broken.");
      }
      console.log("SONG MATCH: ", songMatch);
      commit("_setCurrentSongObj", songMatch);
    },
    /**
     * Fetches the album from Johan's api
     */
    _fetchCurrentAlbum: async ({ state, rootState, getters, commit }) => {
      let albumID = getters.getCurrentAlbumID;

      const albumFetchUrl = rootState.apiURL + "/api/yt/album/" + albumID; // bra
      let albumMatch;

      await fetch(albumFetchUrl)
        .then((response) => response.json())
        .then((data) => (albumMatch = data)); // data contains an array "content", containing one item.

      let error = albumMatch.error;
      if (error) {
        console.log("Error: ", error);
        alert("This album is broken. Error message: " + error);
        state.albumError = true;
        return;
      }
      console.log("Album object: ", albumMatch);
      commit("_setCurrentAlbumObj", albumMatch);
    },

    /**
     * Fetches playlist based on song playing right now.
     */
    fetchPlaylist: async ({ getters, commit, state, rootState }) => {
      let artistName = getters.getCurrentSongObj.artist.name;
      const playlistFetchUrl = rootState.apiURL + "/api/yt/songs/" + artistName; // funkar
      let playlist;
      await fetch(playlistFetchUrl)
        .then((response) => response.json())
        .then((data) => {
          playlist = data.content.map((obj) => obj.videoId);
        });

      let currentSongID = getters.getCurrentSongID;

      // Remove searched song from playlist so that it doesn't play two times.
      playlist = playlist.filter((song) => song != currentSongID);
      // Add searched song to beginning of playlist.
      playlist.unshift(currentSongID);

      commit("setPlaylist", playlist);
    },

    /**
     * Picks out the songs in the already saved album
     */
    _fetchAlbumPlaylist: async ({ getters, commit, dispatch, state, rootState }) => {
      let album = getters.getCurrentAlbumObj;

      let playlist = album.tracks.map((track) => track.videoId);

      console.log("--==:: fetchAlbumPlaylist ::==--");
      commit("setPlaylist", playlist);
    },
  },
  getters: {
    isPlayerReady: (state) => {
      return state.isPlayerReady;
    },
    /* 
    Player.getPlayerState():Number
      Returns the state of the Player. Possible values are:
       -1 – unstarted
        0 – ended
        1 – playing
        2 – paused
        3 – buffering
        5 – video cued
      100 - Player not initialized
    */
    getPlayerState: (state) => {
      let playerState = state.playerState;
      if (!playerState) return 100;
      return state.playerState;
    },
    isPlaylistLoaded: (state) => {
      return state.playlist != null;
    },
    getCurrentSongID: (state) => {
      return state.currentSongID;
    },
    getCurrentSongObj: (state) => {
      return state.currentSongObj;
    },
    getCurrentAlbumID: (state) => {
      return state.currentAlbumID;
    },
    getCurrentAlbumObj: (state) => {
      return state.currentAlbumObj;
    },
    getPlaylist: (state) => {
      return state.playlist;
    },
    getCurrentSongIndex: (state) => {
      return state.currentSongIndex;
    },
  },
};
