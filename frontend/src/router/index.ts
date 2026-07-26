import { createRouter, createWebHistory } from "vue-router";

import LandingView from "../views/LandingView.vue";
import ProductsView from "@/views/ProductsView.vue";

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
            name: "Products",
            component: ProductsView,
        },
    ],
});

export default router;
