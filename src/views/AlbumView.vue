<script setup></script>

<script>
import { mapGetters, mapMutations, mapActions, mapState } from "vuex";

export default {
  data() {
    return {
      songReady: false,
      pendingNextSong: false,
    };
  },
  watch: {
    // AlbumView from SearchResults
    async $route(to) {
      let isFromSearchView = to.params.fromSearch;
      console.error("FROM SEARCH VIEW: ", isFromSearchView);
      if (isFromSearchView) {
        this.resetPlayerState();
        console.log(":::::::::: 4 ::::::::::");
        console.log("PLAYING SONG FROM SEARCH RESULTS");
        await this.initSongAlbumPlaylistAndPlayIfPlayerIsReady();
        return;
      }

      let albumID = to.params.id;
      if (albumID == this.getCurrentAlbumID) {
        // SAME ALBUM, DIFFERENT SONG ID
        // Kolla ifall song-id:t redan finns spellistan. Isf, hämta index för den låten
        // och spela upp den.
      }
    },
  },
  async mounted() {
    console.error("MOUNTED!!!!!");
    this.resetPlayerState();

    // Player is loaded for the first time.
    let playerWasReady = await this.initSongAlbumPlaylistAndPlayIfPlayerIsReady();
    console.log(":::::::::: 1 ::::::::::");
    console.log("Player was ready: ", playerWasReady);

    // Next or Previous song is playing
    this.emitter.on("songPlayingUpdated", async ({ videoID, songIndex }) => {
      await this.updateCurrentSong({ index: songIndex });
      console.log(":::::::::: 2 ::::::::::");
    });

    // Will only execute once (or will it??)
    // If player wasn't ready before, check if it is now and get song, cue playlist etc.
    this.emitter.on("playerIsReady", async () => {
      if (!playerWasReady) {
        console.log(":::::::::: 3 ::::::::::");
        await this.initSongAlbumPlaylistAndPlayIfPlayerIsReady();
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
      "getCurrentAlbumObj",
      "getCurrentAlbumID",
      "getCurrentSongIndex",
    ]),
    songReady() {
      return this.songReady;
    },
  },
  methods: {
    ...mapMutations(["updateHeaderInfo", "resetPlayerState"]),
    ...mapActions([
      "fetchCurrentSong",
      "fetchAlbumPlaylist",
      "updateCurrentSong",
      "updateCurrentAlbumAndFetchPlaylist",
    ]),
    async initSongAlbumPlaylistAndPlayIfPlayerIsReady() {
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
        console.error("INIT SONG, ALBUM AND PLAYLIST IF PLAYER IS READY");
        await this._fetchAlbumAndCuePlaylist(songIndex);
        this.songReady = true;
        return true;
      } else {
        return false;
      }
    },
    cuePlaylist(songIndex) {
      this.emitter.emit("cuePlaylist", songIndex);
    },
    /**
     * Fetches the album playlist
     */
    async _fetchAlbumAndCuePlaylist(songIndex) {
      if (this.isPlayerReady) {
        console.log("FETCH ALBUM AND CUE PLAYLIST {");
        let albumId = this.$route.params.id;
        console.log("ALBUM ID: ", albumId);
        console.log("SONG INDEX: ", songIndex);
        await this.updateCurrentAlbumAndFetchPlaylist({
          albumId: this.$route.params.id,
          songIndex: songIndex,
        });
        this.cuePlaylist(songIndex);
      }
      this.updateHeaderInfo([
        this.getCurrentAlbumObj.title + " by " + this.getCurrentAlbumObj.artist[0].name,
        "Album",
      ]);
      console.log("} DONE");
    },
    play() {
      this.emitter.emit();
    },
  },
};
</script>

<template>
  <div v-if="this.isPlayerReady && this.songReady" id="album-view-container">
    <div id="album-cover">
      <img
        referrerpolicy="no-referrer"
        class="cover-image"
        v-if="this.getCurrentSongObj.thumbnails"
        :src="this.getCurrentSongObj.thumbnails[1].url"
      />
      <img class="cover-image" v-else src="/src/assets/song_placeholder.bmp" />
    </div>
    <div id="album-info">
      <div class="album-info-row">
        <span class="label">Song Name: </span>
        <span class="value">{{ this.getCurrentSongObj.name }}</span>
      </div>
      <div class="album-info-row">
        <span class="label">Artist: </span>
        <span class="value">{{ this.getCurrentSongObj.artist.name }}</span>
      </div>
      <div class="album-info-row">
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
#album-view-container {
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: fit-content 1fr;
  column-gap: 50px;
  padding: 20px;

  #album-cover {
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

  #album-info {
    border: 1px solid rgb(44, 44, 44);
    grid-column-start: 2;
    padding: 25px;
    .album-info-row {
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
