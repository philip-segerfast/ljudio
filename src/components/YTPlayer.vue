<script setup>
import { onMounted, ref } from "vue";
import { mapActions, mapGetters, mapMutations, useStore } from "vuex";
import { useRouter, useRoute } from "vue-router";
import useEmitter from "../composables/useEmitter";

const store = useStore();
const emitter = useEmitter();
const router = useRouter();
const route = useRoute();
let thePlayer = ref(null);
let playerReady = false;
let pendingNextSong = false;

console.log("YTPLAYER SETUP EXECUTED");

onMounted(() => {
  let tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
});

window.onYouTubeIframeAPIReady = () => initYoutube();

function initYoutube() {
  thePlayer.value = new YT.Player("player", {
    height: 1,
    width: 1,
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
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });

  thePlayer.value.setSize(100, 100);
  // console.log("Player: ", thePlayer.value);

  function onPlayerReady(event) {
    playerReady = true;
    store.commit("setPlayerReady", true);
    emitter.emit("playerIsReady");
  }

  async function onPlayerStateChange(event) {
    store.commit("setPlayerState", event.data);
    emitter.emit("onPlayerStateUpdate", event.data);

    switch (event.data) {
      case -1: // unstarted
        break;
      case 0: // ended
        break;
      case 1: // started playing
        if (pendingNextSong) {
          console.log("----------- CURRENT SONG UPDATING -----------");
          // The player was told to play the next/previous song, but it takes
          // some time for it to load it. This code is run when the next/previous
          // song has loaded. When it's done, it updates the store with the new video.
          pendingNextSong = false;
          console.log("NEXT SONG");
          // console.log("Next video ID: ", thePlayer.value.getVideoData().video_id);
          emitter.emit("songPlayingUpdated", {
            videoID: thePlayer.value.getVideoData().video_id,
            songIndex: thePlayer.value.getPlaylistIndex(),
          });
        }
        break;
      case 2: // paused
        break;
      case 3: // buffering
        break;
      case 5: // video cued
        break;
      default:
        // wut
        alert("Något gick allvarligt fel... Är det ens möjligt?");
        break;
    }
    // console.log("Player state changed...");
  }

  function onPlayerError(event) {
    let errorCode = event.data;
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
        console.log(event);
        break;
    }
    console.log("Error occurred:", errorDescription);
  }
}

emitter.on("cue", (videoId) => cue(videoId));
emitter.on("play", () => play());
emitter.on("pause", () => pause());
emitter.on("loadSong", (videoId) => loadSong(videoId));
emitter.on("cuePlaylist", (songIndex) => cuePlaylist(songIndex));

function cue(videoId) {
  if (playerReady) {
    thePlayer.value.cueVideoById(videoId);
  }
}

async function cuePlaylist(startIndex) {
  console.log("::::::::::::::::::::::::::CUE PLAYLIST CALLED::::::::::::::::::::::::::");
  let playlist = store.getters.getPlaylist;
  if (playerReady) {
    if (startIndex) {
      await thePlayer.value.loadPlaylist(playlist, startIndex);
      // store._setCurrentSongIndex(startIndex); // FARLIGT
    } else {
      await thePlayer.value.loadPlaylist(playlist);
    }
    thePlayer.value.setLoop(true);
  } else {
    console.log("tried to cue playlist when player wasn't ready.");
  }
}

/**
 * Vet inte om async gör något i detta fallet, men skriver det ändå...
 */
async function play(index) {
  console.log("Play called");
  if (playerReady) {
    if (index) {
      await thePlayer.value.playVideoAt(index);
    } else {
      await thePlayer.value.playVideo();
    }
  }
}

function playPreviousSong() {
  if (playerReady) {
    let previousIndex;
    let playerInfo = this.thePlayer.playerInfo;
    let currentSongIndex = playerInfo.playlistIndex;
    let playlistLength = playerInfo.playlist.length;

    if (currentSongIndex == 0) {
      // första låten
      previousIndex = playlistLength - 1;
      console.log("PREVIOUSE INDEX = ", playlistLength - 1);
    } else {
      console.log("PREVIOUS INDEX: ", currentSongIndex - 1);
      previousIndex = currentSongIndex - 1;
    }

    let pageName;
    let currentRoute = store.getters.getCurrentRoute;
    if (currentRoute == "AlbumView") {
      pageName = "AlbumView";
    } else if (currentRoute == "MusicView") {
      pageName = "MusicView";
    } else {
      pageName = "SearchView";
    }

    let _id = this.thePlayer.getVideoData().video_id;
    router.push({
      name: pageName,
      params: {
        id: _id,
        songIndex: previousIndex,
        fromSearch: false,
      },
    });

    thePlayer.value.previousVideo();
    pendingNextSong = true;
  }
}

function playNextSong() {
  if (playerReady) {
    let nextIndex;
    let playerInfo = this.thePlayer.playerInfo;
    let currentSongIndex = playerInfo.playlistIndex;
    let playlistLength = playerInfo.playlist.length;

    if (currentSongIndex + 1 == playlistLength) {
      nextIndex = 0;
      console.log("NEXT INDEX = 0");
    } else {
      console.log("NEXT INDEX = ", currentSongIndex + 1);
      nextIndex = currentSongIndex + 1;
    }

    let pageName;
    let currentRoute = store.getters.getCurrentRoute;
    if (currentRoute == "AlbumView") {
      pageName = "AlbumView";
    } else if (currentRoute == "MusicView") {
      pageName = "MusicView";
    } else {
      pageName = "SearchView";
    }

    let _id = this.thePlayer.getVideoData().video_id;
    router.push({
      name: pageName,
      params: {
        id: _id,
        songIndex: nextIndex,
        fromSearch: false,
      },
    });

    thePlayer.value.nextVideo();
    pendingNextSong = true;
  }
}

function pause() {
  if (playerReady) {
    thePlayer.value.pauseVideo();
  }
}

function loadSong(videoId) {
  if (playerReady) {
    thePlayer.value.loadVideoById(videoId);
  }
}
</script>

<script>
export default {
  mounted() {},
  data() {
    return {};
  },
  components: {},
  methods: {
    ...mapMutations(["updatePlayerState", "setPlaylist"]),
  },
  computed: {
    ...mapGetters(["isPlayerReady"]),
  },
  watch: {},
};
</script>

<template>
  <div id="player"></div>
  <div id="yt-player-container">
    <div v-if="isPlayerReady">
      <button @click="playPreviousSong()" class="control-button">&#60;</button>
      <button @click="play()" class="control-button">play</button>
      <button @click="pause()" class="control-button">pause</button>
      <button @click="playNextSong()" class="control-button">&#62;</button>
    </div>
  </div>
</template>

<style lang="scss">
#yt-player-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-top: auto;
}
</style>

<style lang="scss">
#player {
  display: none;
}
</style>
