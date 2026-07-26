<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const navigation = [
    {
        name: "Home",
        path: "/",
    },
    {
        name: "Products",
        path: "/products",
    },
    {
        name: "Servers",
        path: "/servers",
    },
    {
        name: "Networking",
        path: "/networking",
    },
    {
        name: "Storage",
        path: "/storage",
    },
    {
        name: "Support",
        path: "/support",
    },
];
</script>

<template>
    <header class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950">
        <div
            class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
        >
            <RouterLink
                to="/"
                class="text-2xl font-bold tracking-wide text-white"
            >
                Project-04
            </RouterLink>

            <nav class="hidden gap-8 lg:flex">
                <RouterLink
                    v-for="item in navigation"
                    :key="item.path"
                    :to="item.path"
                    class="relative py-5 text-sm font-medium transition-colors"
                    :class="
                        route.path === item.path
                            ? 'text-white'
                            : 'text-zinc-400 hover:text-white'
                    "
                >
                    {{ item.name }}

                    <span
                        v-if="route.path === item.path"
                        class="absolute bottom-0 left-0 h-0.5 w-full rounded bg-cyan-500"
                    />
                </RouterLink>
            </nav>

            <div class="flex items-center gap-6">
                <button class="text-zinc-400 transition hover:text-white">
                    Search
                </button>

                <button class="text-zinc-400 transition hover:text-white">
                    Wishlist
                </button>

                <button class="text-zinc-400 transition hover:text-white">
                    Cart
                </button>

                <button
                    class="rounded-md border border-zinc-700 px-4 py-2 text-sm text-white transition hover:border-cyan-500"
                >
                    Account
                </button>
            </div>
        </div>
    </header>
</template>
