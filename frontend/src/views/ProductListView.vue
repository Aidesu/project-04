<script setup lang="ts">
import { computed, ref, watch, watchEffect } from "vue";
import { useRoute, useRouter } from "vue-router";
import { api, errorMessage } from "@/api/client";
import AppIcon from "@/components/AppIcon.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductCardSkeleton from "@/components/ProductCardSkeleton.vue";
import StateMessage from "@/components/StateMessage.vue";
import { useCategories } from "@/composables/useCategories";
import { useDebounced } from "@/composables/useDebounced";
import type { Product } from "@/types";

// Absent sur /search : on cherche alors dans tout le catalogue
const props = defineProps<{ category?: string }>();

const route = useRoute();
const router = useRouter();
const { categories, nameOf } = useCategories();

const queryParam = () => (typeof route.query.q === "string" ? route.query.q : "");

// ----- Recherche (synchronisée avec ?q= dans l'URL) -----
const search = ref(queryParam());
const debouncedSearch = useDebounced(search, 300);

watch(
    () => route.query.q,
    () => {
        const q = queryParam();
        if (q !== search.value) {
            search.value = q;
            debouncedSearch.value = q;
        }
    },
);

watch(debouncedSearch, (value) => {
    const q = value.trim();
    if (q !== queryParam()) {
        router.replace({ query: { ...route.query, q: q || undefined } });
    }
});

// ----- Chargement -----
const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
let requestId = 0;

async function load() {
    const id = ++requestId;
    loading.value = true;
    error.value = null;
    try {
        const data = await api.getProducts({
            category: props.category,
            search: debouncedSearch.value,
        });
        if (id === requestId) products.value = data;
    } catch (e) {
        if (id === requestId) error.value = errorMessage(e);
    } finally {
        if (id === requestId) loading.value = false;
    }
}

watch([() => props.category, debouncedSearch], load, { immediate: true });

// ----- Filtres & tri (côté client) -----
type SortKey = "recent" | "price-asc" | "price-desc" | "name";
const sort = ref<SortKey>("recent");
const inStockOnly = ref(false);
const selectedBrands = ref<string[]>([]);

watch(
    () => props.category,
    () => (selectedBrands.value = []),
);

const brands = computed(() =>
    [...new Set(products.value.map((p) => p.brand))].sort((a, b) =>
        a.localeCompare(b),
    ),
);

function toggleBrand(brand: string) {
    const list = selectedBrands.value;
    selectedBrands.value = list.includes(brand)
        ? list.filter((b) => b !== brand)
        : [...list, brand];
}

const hasFilters = computed(
    () => inStockOnly.value || selectedBrands.value.length > 0,
);

function resetFilters() {
    inStockOnly.value = false;
    selectedBrands.value = [];
}

function clearSearch() {
    search.value = "";
    debouncedSearch.value = "";
}

const visible = computed(() => {
    let list = products.value.filter(
        (p) =>
            (!inStockOnly.value || p.stock > 0) &&
            (!selectedBrands.value.length ||
                selectedBrands.value.includes(p.brand)),
    );
    const sorters: Record<SortKey, ((a: Product, b: Product) => number) | null> = {
        recent: null,
        "price-asc": (a, b) => a.price - b.price,
        "price-desc": (a, b) => b.price - a.price,
        name: (a, b) => a.name.localeCompare(b.name),
    };
    const sorter = sorters[sort.value];
    if (sorter) list = [...list].sort(sorter);
    return list;
});

// ----- Textes -----
const trimmedSearch = computed(() => debouncedSearch.value.trim());

const title = computed(() => {
    if (props.category) return nameOf(props.category);
    if (trimmedSearch.value) return `Résultats pour « ${trimmedSearch.value} »`;
    return "Tous les produits";
});

watchEffect(() => {
    document.title = `${title.value} · Project-04`;
});

const countLabel = computed(() => {
    const n = visible.value.length;
    return `${n} produit${n > 1 ? "s" : ""}`;
});
</script>

<template>
    <div class="container-page py-10 sm:py-14">
        <!-- Fil d'Ariane -->
        <nav aria-label="Fil d'Ariane" class="mb-6 text-sm text-zinc-500">
            <ol class="flex flex-wrap items-center gap-1.5">
                <li>
                    <RouterLink to="/" class="hover:text-zinc-300">Accueil</RouterLink>
                </li>
                <li><AppIcon name="chevronRight" class="h-3.5 w-3.5" /></li>
                <li>
                    <RouterLink to="/products" class="hover:text-zinc-300"
                        >Catalogue</RouterLink
                    >
                </li>
                <li><AppIcon name="chevronRight" class="h-3.5 w-3.5" /></li>
                <li class="text-zinc-300" aria-current="page">
                    {{ category ? nameOf(category) : "Recherche" }}
                </li>
            </ol>
        </nav>

        <header class="mb-8 flex flex-col gap-2">
            <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {{ title }}
            </h1>
            <p class="text-zinc-400" aria-live="polite">
                <template v-if="loading && !products.length">Chargement…</template>
                <template v-else>{{ countLabel }}</template>
            </p>
        </header>

        <!-- Raccourcis catégories -->
        <div
            v-if="categories.length"
            class="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0"
        >
            <RouterLink
                :to="{ name: 'search', query: trimmedSearch ? { q: trimmedSearch } : {} }"
                class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition"
                :class="
                    !category
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                "
                >Tout</RouterLink
            >
            <RouterLink
                v-for="cat in categories"
                :key="cat._id"
                :to="{
                    name: 'products',
                    params: { category: cat.slug },
                    query: trimmedSearch ? { q: trimmedSearch } : {},
                }"
                class="shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition"
                :class="
                    category === cat.slug
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-200'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                "
                >{{ cat.name }}</RouterLink
            >
        </div>

        <!-- Barre d'outils -->
        <div
            class="mb-4 flex flex-col gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-3 md:flex-row md:items-center"
        >
            <div class="relative flex-1">
                <AppIcon
                    name="search"
                    class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500"
                />
                <input
                    v-model="search"
                    type="search"
                    :placeholder="
                        category
                            ? `Rechercher dans ${nameOf(category)}…`
                            : 'Rechercher un produit, une marque…'
                    "
                    aria-label="Rechercher"
                    class="input pl-9"
                />
            </div>

            <div class="flex items-center gap-3">
                <label
                    class="flex cursor-pointer select-none items-center gap-2 whitespace-nowrap rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-300 hover:border-zinc-700"
                >
                    <input
                        v-model="inStockOnly"
                        type="checkbox"
                        class="h-4 w-4 accent-indigo-500"
                    />
                    En stock
                </label>

                <label class="sr-only" for="sort">Trier par</label>
                <select
                    id="sort"
                    v-model="sort"
                    class="input w-auto cursor-pointer py-2.5 pr-8"
                >
                    <option value="recent">Plus récents</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                    <option value="name">Nom (A → Z)</option>
                </select>
            </div>
        </div>

        <!-- Filtre marques -->
        <div
            v-if="brands.length > 1"
            class="mb-8 flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filtrer par marque"
        >
            <span class="mr-1 text-xs font-medium uppercase tracking-wider text-zinc-500"
                >Marques</span
            >
            <button
                v-for="brand in brands"
                :key="brand"
                type="button"
                class="rounded-full border px-3 py-1 text-sm transition"
                :class="
                    selectedBrands.includes(brand)
                        ? 'border-indigo-500 bg-indigo-500 text-white'
                        : 'border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-white'
                "
                :aria-pressed="selectedBrands.includes(brand)"
                @click="toggleBrand(brand)"
            >
                {{ brand }}
            </button>
            <button
                v-if="hasFilters"
                type="button"
                class="ml-1 text-sm font-medium text-indigo-400 hover:text-indigo-300"
                @click="resetFilters"
            >
                Réinitialiser
            </button>
        </div>
        <div v-else class="mb-8" />

        <!-- Résultats -->
        <div
            v-if="loading && !products.length"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
            <ProductCardSkeleton v-for="n in 8" :key="n" />
        </div>

        <StateMessage
            v-else-if="error"
            tone="error"
            icon="warning"
            title="Impossible de charger les produits"
            :message="error"
        >
            <button class="btn btn-ghost" @click="load">
                <AppIcon name="refresh" class="h-4 w-4" /> Réessayer
            </button>
        </StateMessage>

        <StateMessage
            v-else-if="!products.length && trimmedSearch"
            title="Aucun résultat"
            :message="`Aucun produit ne correspond à « ${trimmedSearch} ». Vérifiez l'orthographe ou essayez un terme plus général.`"
        >
            <button class="btn btn-ghost" @click="clearSearch">
                Effacer la recherche
            </button>
        </StateMessage>

        <StateMessage
            v-else-if="!products.length"
            icon="bag"
            title="Aucun produit dans cette catégorie"
            message="Revenez bientôt, de nouveaux produits arrivent régulièrement."
        >
            <RouterLink to="/products" class="btn btn-ghost"
                >Voir les autres catégories</RouterLink
            >
        </StateMessage>

        <StateMessage
            v-else-if="!visible.length"
            title="Aucun produit ne correspond aux filtres"
        >
            <button class="btn btn-ghost" @click="resetFilters">
                Réinitialiser les filtres
            </button>
        </StateMessage>

        <div
            v-else
            class="grid grid-cols-1 gap-6 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            :class="{ 'opacity-50': loading }"
            :aria-busy="loading"
        >
            <ProductCard v-for="p in visible" :key="p._id" :product="p" />
        </div>
    </div>
</template>
