/* eslint-disable no-undef */
import { createRouter, createWebHistory } from "vue-router";

import SearchView from "../views/SearchView.vue";
import MusicView from "../views/MusicView.vue";
import AlbumView from "../views/AlbumView.vue";
import Player from "../components/Player.vue";

const routes = [
  {
    path: "/",
    name: "SearchView",
    component: SearchView,
  },
  {
    path: "/music/:id/:songIndex?:fromSearch?",
    name: "MusicView",
    component: MusicView,
  },
  {
    path: "/album/:id/:songIndex/:fromSearch?",
    name: "AlbumView",
    component: AlbumView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
