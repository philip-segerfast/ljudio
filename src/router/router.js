/* eslint-disable no-undef */
import { createRouter, createWebHistory } from "vue-router";

import SearchView from "../views/SearchView.vue";
import MusicView from "../views/MusicView.vue";
import Player from "../components/Player.vue";

const routes = [
  {
    path: "/",
    name: "SearchView",
    component: SearchView,
  },
  {
    path: "/music/:id",
    name: "MusicView",
    component: MusicView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
