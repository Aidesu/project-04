import { createRouter, createWebHistory } from "vue-router";

import LandingView from "../views/LandingView.vue";
import CategoryView from "@/views/CategoryView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "Landing",
            component: LandingView,
        },
        {
            path: "/products",
            name: "Categories",
            component: CategoryView,
        },
    ],
});

export default router;
