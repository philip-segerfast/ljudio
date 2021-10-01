import { createApp } from "vue";
import App from "./App.vue";
import router from "./router/router.js";
import store from "./store/store.js";
import mitt from "mitt";
const emitter = mitt();

/*
// append youtube iFrame API from https://www.youtube.com/iframe_api
// docs: https://developers.google.com/youtube/iframe_api_reference#Getting_Started
var tag = document.createElement("script");
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName("script")[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

window.onYouTubeIframeAPIReady = () => {
  store.dispatch("initYTPlayer");
};*/

var app = createApp(App).use(store).use(router);
app.config.globalProperties.emitter = emitter;
app.mount("#app");
