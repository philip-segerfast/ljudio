import { ref, toRefs, toRef } from "vue";

const theModule = {
  state: {
    YTPlayer: null,
    playerReady: false,
  },
  mutations: {
    setYTPlayer(state, payload) {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      let payloadYTPlayer = payload;
      let payloadToReactive = toRef(payloadYTPlayer);
      state.YTPlayer = payloadToReactive;
      let stateYTPlayer = state.YTPlayer;

      console.log("State:");
      console.log(stateYTPlayer);
      console.log(stateYTPlayer.getPlayerState());
      // console.log("Payload:");
      // console.log(payloadYTPlayer);
      // console.log(payloadYTPlayer.getPlayerState());
      console.log("Payload To Reactive:");
      console.log(payloadToReactive);
      console.log(payloadToReactive.getPlayerState());

      // console.log("Same: ", stateYTPlayer === payloadYTPlayer);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      state.playerReady = true;
    },
    // cueSong(state, videoId) {
    //   state.YTPlayer.cueVideoById(videoId);
    // },
    // playSong(state) {
    //   console.log("Playing");
    //   state.YTPlayer.playVideo();
    // },
    // pauseSong(state) {
    //   state.YTPlayer.pause();
    // },
    // loadSong(state, payload) {
    //   state.YTPlayer.loadVideoById(payload);
    // },
  },
  actions: {
    playSong({ commit, getters }) {
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      console.log(getters.YTPlayerInitialized);
      console.log(getters.cued);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!");

      if (getters.YTPlayerInitialized) {
        if (getters.cued) {
          commit("playSong");
        } else {
          console.error("No cued songs");
        }
      } else {
        console.error("YTPlayer not ready");
      }
    },
    pauseSong() {},
    playNextSong() {},
    playPreviousSong() {},
    initYTPlayer: ({ state, dispatch, commit, getters }) => {
      let tmpPlayer = new YT.Player("player", {
        playerVars: {
          videoId: "",
          autoplay: 0,
          loop: 0,
          controls: 0, // no player controls
          playsinline: 0, // ios stuff
          disablekb: 1, // disable keyboard input
          modestbranding: 1, // remove youtube logo
        },
        events: {
          onReady: function () {
            dispatch("onYTPlayerReady", tmpPlayer);
          },
          onStateChange: function (evt) {
            dispatch("onPlayerStateChange", evt);
          },
          onError: (evt) => dispatch("onPlayerError", evt),
        },
      });
      tmpPlayer.setSize(0, 0);
    },
    onYTPlayerReady({ commit, getters, state }, payload) {
      commit("setYTPlayer", payload);
    },
    onPlayerStateChange(evt) {},
    onPlayerError({}, evt) {
      let errorCode = evt.data;
      let errorDescription;
      switch (errorCode) {
        case 2:
          errorDescription =
            "The request contains an invalid parameter value. For example, this error occurs if you specify a video ID that does not have 11 characters, or if the video ID contains invalid characters, such as exclamation points or asterisks.";
          break;
        case 5:
          errorDescription =
            "The requested content cannot be played in an HTML5 YTPlayer or another error related to the HTML5 YTPlayer has occurred.";
          break;
        case 100:
          errorDescription =
            "The video requested was not found. This error occurs when a video has been removed (for any reason) or has been marked as private.";
          break;
        case 101:
        case 150:
          errorDescription =
            "The owner of the requested video does not allow it to be played in embedded YTPlayers.";
          break;
        default:
          errorDescription = "UNKNOWN ERROR! This shouldn't happen.";
          console.log(evt);
          break;
      }
      console.log("Error occurred:", errorDescription);
    },
  },
  getters: {
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
    isPlayerReady(state, getters) {
      return state.playerReady;
    },
    getYTPlayerState(state, getters) {
      let ret = getters.getYTPlayer().value.getPlayerState();
      console.log("ret:::::: ", ret);
      return ret;
    },
    YTPlayerInitialized(state) {
      return state.YTPlayer != null;
    },
    getYTPlayer(state) {
      console.log("GETYTPLAYER");
      console.log("getYTPlayer: ", state.YTPlayer);
      return state.YTPlayer;
    },
    playing(state, getters) {
      getters.getYTPlayerState == 1 ? true : false;
    },
    unstarted(state, getters) {
      getters.getYTPlayerState == -1 ? true : false;
    },
    paused(state, getters) {
      getters.getYTPlayerState == 2 ? true : false;
    },
    buffering(state, getters) {
      let res = getters.getYTPlayerState == 3 ? true : false;
      return res;
    },
    cued(state, getters) {
      return getters.getYTPlayerState == 5 ? true : false;
    },
    readyToPlay(state, getters) {
      if (!getters.YTPlayerInitialized) return false;

      let buffering = getters.buffering;
      let cued = getters.cued;
      let playerInit = getters.YTPlayerInitialized;
      let playing = getters.playing;

      // console.log("buffering: ", buffering);
      // console.log("cued: ", cued);
      // console.log("player init: ", playerInit);
      // console.log("playing: ", playing);

      if (getters.buffering || (!getters.cued && !playing) || !getters.YTPlayerInitialized) {
        // console.log("ready to play: ", false);
        return false;
      } else {
        // console.log("ready to play: ", true);
        return true;
      }
    },
  },
};

export default theModule;
