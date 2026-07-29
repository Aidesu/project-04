import { createRouter, createWebHistory } from "vue-router";

import LandingView from "../views/LandingView.vue";
import CategoryView from "@/views/CategoryView.vue";
import ProductListView from "@/views/ProductListView.vue";
import ProductDetailView from "@/views/ProductDetailView.vue";

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
        {
            path: "/products/:category",
            name: "products",
            component: ProductListView,
            props: true,
        },
        {
            path: "/product/:slug",
            name: "product-detail",
            component: () => import("../views/ProductDetailView.vue"),
        },
    ],
});

export default router;
