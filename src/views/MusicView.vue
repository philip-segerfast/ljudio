<script setup></script>

<script>
import { mapGetters, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      songReady: false,
      pendingNextSong: false,
    };
  },
  watch: {
    // MusicView from SearchResults.
    async $route(to, from) {
      // Song updated.
      // await this.newSongPlaying();
      let isFromSearchView = to.params.fromSearch;
      if (isFromSearchView) {
        this.resetPlayerState();
        console.log(":::::::::: 4 ::::::::::");
        await this.initSongAndPlaylistAndPlayIfPlayerIsReady();
        return;
      }
    },
  },
  async mounted() {
    console.log("MOUNTED!!!!!");
    this.resetPlayerState();

    // Player is loaded for the first time.
    let playerWasReady = await this.initSongAndPlaylistAndPlayIfPlayerIsReady();
    console.log(":::::::::: 1 ::::::::::");
    console.log("Player was ready: ", playerWasReady);

    // Next or Previous song is playing
    this.emitter.on("songPlayingUpdated", async ({ videoID, songIndex }) => {
      await this.updateCurrentSong({ index: songIndex });
      console.log(":::::::::: 2 ::::::::::");

      // this.fetchAndCuePlaylist();
      // await this.playNextOrPreviousSong();
    });

    // Will only execute once (or will it??)
    // If player wasn't ready before, check if it is now and get song, cue playlist etc.
    this.emitter.on("playerIsReady", async () => {
      if (!playerWasReady) {
        console.log(":::::::::: 3 ::::::::::");
        await this.initSongAndPlaylistAndPlayIfPlayerIsReady();
        console.error("Player is ready! Make sure this message only shows once!.");
      }
    });
  },
  components: {},
  computed: {
    ...mapGetters([
      "getCurrentRoute",
      "shouldMoveSearchBar",
      "isPlayerReady",
      "isPlaylistLoaded",
      "getCurrentSongObj",
      "getCurrentSongID",
    ]),
    songReady() {
      return this.songReady;
    },
  },
  methods: {
    ...mapMutations(["updateHeaderInfo", "resetPlayerState"]),
    ...mapActions(["fetchCurrentSong", "fetchPlaylist", "updateCurrentSong"]),
    async initSongAndPlaylistAndPlayIfPlayerIsReady() {
      /**
          *  Se till att player är initialiserad.
          1. Spara låt-ID:t i store och fetcha den från Johans API (updateCurrentSong)
          2. Hämta spellista baserat på låten
          3. Cue:a spellistan när spelaren är redo.
              Om den inte är redo, cue:a den när den är det.
       */
      let playerIsReady = this.isPlayerReady;
      if (playerIsReady) {
        let songIndex = this.$route.params.songIndex;
        await this.updateCurrentSong({ songId: this.$route.params.id });
        this.songReady = true;
        await this.fetchAndCuePlaylist(this.$route.params.songIndex);
        return true;
      } else {
        return false;
      }
    },
    cuePlaylist(songIndex) {
      this.emitter.emit("cuePlaylist", songIndex);
    },
    /**
     * Fetches a playlist based on the current song and cues it.
     */
    async fetchAndCuePlaylist(songIndex) {
      if (this.isPlayerReady) {
        await this.fetchPlaylist();
        this.cuePlaylist(songIndex);
      }
      this.updateHeaderInfo([this.getCurrentSongObj.name, "Song"]);
    },
    play() {
      this.emitter.emit();
    },
  },
};
</script>

<template>
  <div v-if="this.isPlayerReady && this.songReady" id="music-view-container">
    <div id="music-cover">
      <img
        referrerpolicy="no-referrer"
        class="cover-image"
        v-if="this.getCurrentSongObj.thumbnails"
        :src="this.getCurrentSongObj.thumbnails[1].url"
      />
      <img class="cover-image" v-else src="/src/assets/song_placeholder.bmp" />
    </div>
    <div id="music-info">
      <div class="music-info-row">
        <span class="label">Song Name: </span>
        <span class="value">{{ this.getCurrentSongObj.name }}</span>
      </div>
      <div class="music-info-row">
        <span class="label">Artist: </span>
        <span class="value">{{ this.getCurrentSongObj.artist.name }}</span>
      </div>
      <div class="music-info-row">
        <span class="label">Album: </span>
        <span class="value">{{ this.getCurrentSongObj.album.name }}</span>
      </div>
    </div>
  </div>
  <div v-else id="loading">
    <h1>Loading...</h1>
  </div>
</template>

<style lang="scss" scoped>
#music-view-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: fit-content 1fr;
  column-gap: 50px;
  padding: 20px;

  #music-cover {
    position: relative;
    display: flex;
    grid-column-start: 1;
    align-items: center;
    justify-content: center;
    width: 100%;
    outline: 1px solid rgb(42, 42, 42);
    .cover-image {
      object-fit: contain;
      padding: 30px;
      width: 50%;
    }
  }

  #music-info {
    border: 1px solid rgb(44, 44, 44);
    grid-column-start: 2;
    padding: 25px;
    .music-info-row {
      margin-bottom: 10px;
      font-size: x-large;
      .label {
        color: rgb(83, 83, 83);
      }

      .value {
      }
    }
  }
}

#loading {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
</style>
