import { createRouter, createWebHistory } from "vue-router";

import LandingView from "@/views/LandingView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            name: "landing",
            component: LandingView,
        },
        {
            path: "/products",
            name: "categories",
            component: () => import("@/views/CategoryView.vue"),
            meta: { title: "Catalogue" },
        },
        {
            path: "/products/:category",
            name: "products",
            component: () => import("@/views/ProductListView.vue"),
            props: true,
        },
        {
            path: "/search",
            name: "search",
            component: () => import("@/views/ProductListView.vue"),
        },
        {
            path: "/product/:slug",
            name: "product-detail",
            component: () => import("@/views/ProductDetailView.vue"),
            props: true,
        },
        {
            path: "/:pathMatch(.*)*",
            name: "not-found",
            component: () => import("@/views/NotFoundView.vue"),
            meta: { title: "Page introuvable" },
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition;
        // Changer seulement les filtres / la recherche ne doit pas remonter la page
        if (to.path === from.path) return false;
        return { top: 0 };
    },
});

// Titre par défaut ; les pages produit/catégorie le précisent elles-mêmes
router.afterEach((to) => {
    const title = to.meta.title as string | undefined;
    document.title = title ? `${title} · Project-04` : "Project-04";
});

export default router;
