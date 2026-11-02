<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import AppIcon from "@/components/AppIcon.vue";
import { useCategories } from "@/composables/useCategories";

const route = useRoute();
const router = useRouter();
const { categories } = useCategories();

const mobileOpen = ref(false);
const query = ref("");

// Les premières catégories servent de navigation principale
const navCategories = computed(() => categories.value.slice(0, 4));

const currentCategory = computed(() =>
    route.name === "products" ? String(route.params.category ?? "") : "",
);

// Le champ de recherche reflète la recherche en cours
watch(
    () => route.query.q,
    (q) => (query.value = typeof q === "string" ? q : ""),
    { immediate: true },
);

// Fermer le menu mobile à chaque navigation
watch(
    () => route.fullPath,
    () => (mobileOpen.value = false),
);

function submitSearch() {
    const q = query.value.trim();
    router.push({ name: "search", query: q ? { q } : {} });
}

const linkClass = (active: boolean) =>
    active
        ? "text-white bg-zinc-800/80"
        : "text-zinc-400 hover:text-white hover:bg-zinc-900";
</script>

<template>
    <header
        class="sticky top-0 z-50 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-xl"
    >
        <div class="container-page flex h-16 items-center gap-6">
            <RouterLink
                to="/"
                class="flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-indigo-400"
            >
                <span
                    class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30"
                >
                    <AppIcon name="cpu" class="h-5 w-5" />
                </span>
                <span class="text-lg font-bold tracking-tight text-white"
                    >Project-04</span
                >
            </RouterLink>

            <!-- Navigation desktop -->
            <nav class="hidden items-center gap-1 lg:flex" aria-label="Principale">
                <RouterLink
                    to="/products"
                    class="rounded-lg px-3 py-2 text-sm font-medium transition"
                    :class="linkClass(route.name === 'categories')"
                >
                    Catalogue
                </RouterLink>
                <RouterLink
                    v-for="cat in navCategories"
                    :key="cat._id"
                    :to="{ name: 'products', params: { category: cat.slug } }"
                    class="rounded-lg px-3 py-2 text-sm font-medium transition"
                    :class="linkClass(currentCategory === cat.slug)"
                >
                    {{ cat.name }}
                </RouterLink>
            </nav>

            <!-- Recherche desktop -->
            <form
                role="search"
                class="relative ml-auto hidden w-full max-w-xs md:block"
                @submit.prevent="submitSearch"
            >
                <AppIcon
                    name="search"
                    class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                />
                <input
                    v-model="query"
                    type="search"
                    placeholder="Rechercher un produit, une marque…"
                    aria-label="Rechercher"
                    class="input py-2 pl-9"
                />
            </form>

            <button
                type="button"
                class="ml-auto rounded-lg p-2 text-zinc-300 hover:bg-zinc-900 hover:text-white md:ml-0 lg:hidden"
                :aria-expanded="mobileOpen"
                aria-controls="mobile-menu"
                :aria-label="mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
                @click="mobileOpen = !mobileOpen"
            >
                <AppIcon :name="mobileOpen ? 'close' : 'menu'" class="h-6 w-6" />
            </button>
        </div>

        <!-- Menu mobile -->
        <Transition
            enter-from-class="opacity-0 -translate-y-2"
            enter-active-class="transition duration-200"
            leave-to-class="opacity-0 -translate-y-2"
            leave-active-class="transition duration-150"
        >
            <div
                v-if="mobileOpen"
                id="mobile-menu"
                class="border-t border-zinc-800 bg-zinc-950 lg:hidden"
            >
                <div class="container-page space-y-4 py-4">
                    <form
                        role="search"
                        class="relative md:hidden"
                        @submit.prevent="submitSearch"
                    >
                        <AppIcon
                            name="search"
                            class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                        />
                        <input
                            v-model="query"
                            type="search"
                            placeholder="Rechercher…"
                            aria-label="Rechercher"
                            class="input pl-9"
                        />
                    </form>
                    <nav class="grid gap-1" aria-label="Mobile">
                        <RouterLink
                            to="/products"
                            class="rounded-lg px-3 py-2.5 text-sm font-medium"
                            :class="linkClass(route.name === 'categories')"
                        >
                            Tout le catalogue
                        </RouterLink>
                        <RouterLink
                            v-for="cat in categories"
                            :key="cat._id"
                            :to="{
                                name: 'products',
                                params: { category: cat.slug },
                            }"
                            class="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium"
                            :class="linkClass(currentCategory === cat.slug)"
                        >
                            {{ cat.name }}
                            <span class="text-xs text-zinc-500">{{
                                cat.itemCount
                            }}</span>
                        </RouterLink>
                    </nav>
                </div>
            </div>
        </Transition>
    </header>
</template>
