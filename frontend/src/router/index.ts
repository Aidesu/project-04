import { createRouter, createWebHistory } from "vue-router";

import LandingView from "../views/LandingView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Landing",
            component: LandingView,
        },
    ],
});

export default router;
