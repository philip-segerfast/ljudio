<script setup>
/*tslint:disabled*/

function play(id) {
  // calling global variable
  window.player.loadVideoById(id);
  window.player.playVideo();
}

function pause() {
  window.player.pauseVideo();
}
</script>

<template>
  <button @click="play('DXxeOvvNNwc')">The Black Page #1 on piano</button>
  <button @click="play('CtkZxnkbjtI')">The Black Page #2 live band</button>
  <button @click="pause()">Pause</button>
</template>
