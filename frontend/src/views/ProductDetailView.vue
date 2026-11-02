<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { api, errorMessage, isNotFound } from "@/api/client";
import AppIcon from "@/components/AppIcon.vue";
import ProductCard from "@/components/ProductCard.vue";
import ProductImage from "@/components/ProductImage.vue";
import StateMessage from "@/components/StateMessage.vue";
import { useCategories } from "@/composables/useCategories";
import type { Product } from "@/types";
import {
    discountPercent,
    formatPrice,
    formatSpecValue,
    humanizeKey,
} from "@/utils/format";

const props = defineProps<{ slug: string }>();

const { nameOf } = useCategories();

const product = ref<Product | null>(null);
const related = ref<Product[]>([]);
const activeIndex = ref(0);
const loading = ref(true);
const notFound = ref(false);
const error = ref<string | null>(null);
const cartNotice = ref(false);
let requestId = 0;

async function load() {
    const id = ++requestId;
    loading.value = true;
    notFound.value = false;
    error.value = null;
    cartNotice.value = false;
    activeIndex.value = 0;
    related.value = [];

    try {
        const data = await api.getProduct(props.slug);
        if (id !== requestId) return;
        product.value = data;
        document.title = `${data.name} · Project-04`;
        void loadRelated(data, id);
    } catch (e) {
        if (id !== requestId) return;
        product.value = null;
        if (isNotFound(e)) notFound.value = true;
        else error.value = errorMessage(e);
    } finally {
        if (id === requestId) loading.value = false;
    }
}

// Produits de la même catégorie ; la section est masquée s'il n'y en a pas
async function loadRelated(current: Product, id: number) {
    try {
        const data = await api.getProducts({
            category: current.category,
            limit: 5,
        });
        if (id === requestId) {
            related.value = data.filter((p) => p._id !== current._id).slice(0, 4);
        }
    } catch {
        // Non bloquant : on n'affiche simplement pas de suggestions
    }
}

// Se recharge aussi quand on clique sur un produit similaire
watch(() => props.slug, load, { immediate: true });

const images = computed(() => product.value?.images?.filter(Boolean) ?? []);
const activeImage = computed(() => images.value[activeIndex.value]);

const discount = computed(() =>
    product.value ? discountPercent(product.value.price, product.value.oldPrice) : 0,
);

const stockInfo = computed(() => {
    const stock = product.value?.stock ?? 0;
    if (stock <= 0) return { label: "Rupture de stock", tone: "text-rose-400", dot: "bg-rose-400" };
    if (stock <= 5)
        return {
            label: `Plus que ${stock} en stock`,
            tone: "text-amber-400",
            dot: "bg-amber-400",
        };
    return { label: "En stock", tone: "text-emerald-400", dot: "bg-emerald-400" };
});

const specs = computed(() =>
    Object.entries(product.value?.specifications ?? {}).map(([key, value]) => ({
        key,
        label: humanizeKey(key),
        value: formatSpecValue(value),
    })),
);

const summary = computed(() => {
    const p = product.value;
    if (!p) return "";
    if (p.shortDescription) return p.shortDescription;
    if (p.description.length <= 180) return p.description;
    return `${p.description.slice(0, 180).trimEnd()}…`;
});
</script>

<template>
    <div>
        <!-- Chargement -->
        <div v-if="loading && !product" class="container-page py-12" aria-busy="true">
            <div class="skeleton mb-8 h-4 w-64" />
            <div class="grid gap-10 lg:grid-cols-12">
                <div class="skeleton aspect-[4/3] rounded-3xl lg:col-span-7" />
                <div class="space-y-4 lg:col-span-5">
                    <div class="skeleton h-4 w-24" />
                    <div class="skeleton h-10 w-full" />
                    <div class="skeleton h-10 w-3/4" />
                    <div class="skeleton mt-8 h-48 w-full rounded-3xl" />
                </div>
            </div>
        </div>

        <!-- Introuvable / erreur -->
        <div v-else-if="notFound" class="container-page py-24">
            <StateMessage
                icon="warning"
                title="Produit introuvable"
                message="Ce produit n'existe pas ou n'est plus disponible."
            >
                <RouterLink to="/products" class="btn btn-primary"
                    >Parcourir le catalogue</RouterLink
                >
            </StateMessage>
        </div>

        <div v-else-if="error" class="container-page py-24">
            <StateMessage
                tone="error"
                icon="warning"
                title="Impossible de charger ce produit"
                :message="error"
            >
                <button class="btn btn-ghost" @click="load">
                    <AppIcon name="refresh" class="h-4 w-4" /> Réessayer
                </button>
            </StateMessage>
        </div>

        <!-- Fiche produit -->
        <div v-else-if="product" :class="{ 'opacity-60 transition-opacity': loading }">
            <div class="container-page py-10 lg:py-14">
                <nav aria-label="Fil d'Ariane" class="mb-8 text-sm text-zinc-500">
                    <ol class="flex flex-wrap items-center gap-1.5">
                        <li>
                            <RouterLink to="/products" class="hover:text-zinc-300"
                                >Catalogue</RouterLink
                            >
                        </li>
                        <li><AppIcon name="chevronRight" class="h-3.5 w-3.5" /></li>
                        <li>
                            <RouterLink
                                :to="{
                                    name: 'products',
                                    params: { category: product.category },
                                }"
                                class="hover:text-zinc-300"
                                >{{ nameOf(product.category) }}</RouterLink
                            >
                        </li>
                        <li><AppIcon name="chevronRight" class="h-3.5 w-3.5" /></li>
                        <li
                            class="max-w-[16rem] truncate text-zinc-300"
                            aria-current="page"
                        >
                            {{ product.name }}
                        </li>
                    </ol>
                </nav>

                <div class="grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <!-- Galerie -->
                    <div class="flex flex-col gap-4 lg:col-span-7">
                        <div
                            class="relative aspect-[4/3] overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-8"
                        >
                            <div class="absolute left-5 top-5 z-10 flex flex-col items-start gap-2">
                                <span
                                    v-if="discount > 0"
                                    class="rounded-full bg-rose-500 px-3 py-1 text-xs font-bold text-white"
                                    >-{{ discount }}%</span
                                >
                                <span
                                    v-if="product.newArrival"
                                    class="rounded-full bg-indigo-500 px-3 py-1 text-xs font-semibold text-white"
                                    >Nouveau</span
                                >
                                <span
                                    v-if="product.bestSeller"
                                    class="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-zinc-950"
                                    >Best-seller</span
                                >
                            </div>
                            <ProductImage :src="activeImage" :alt="product.name" />
                        </div>

                        <div
                            v-if="images.length > 1"
                            class="grid grid-cols-5 gap-3 sm:grid-cols-6"
                            role="group"
                            aria-label="Images du produit"
                        >
                            <button
                                v-for="(img, index) in images"
                                :key="img"
                                type="button"
                                class="aspect-square overflow-hidden rounded-xl border-2 bg-zinc-900 p-1.5 transition"
                                :class="
                                    index === activeIndex
                                        ? 'border-indigo-500'
                                        : 'border-zinc-800 hover:border-zinc-600'
                                "
                                :aria-label="`Image ${index + 1}`"
                                :aria-pressed="index === activeIndex"
                                @click="activeIndex = index"
                            >
                                <ProductImage :src="img" alt="" />
                            </button>
                        </div>
                    </div>

                    <!-- Infos & achat -->
                    <div class="lg:col-span-5">
                        <div class="flex flex-col gap-6 lg:sticky lg:top-24">
                            <div>
                                <p
                                    class="text-sm font-semibold uppercase tracking-wider text-indigo-400"
                                >
                                    {{ product.brand }}
                                </p>
                                <h1
                                    class="mt-2 text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl"
                                >
                                    {{ product.name }}
                                </h1>
                                <div
                                    class="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-zinc-400"
                                >
                                    <span v-if="product.reviewCount > 0" class="flex items-center gap-1">
                                        <span class="text-amber-400" aria-hidden="true">★</span>
                                        <span class="font-medium text-zinc-200">{{
                                            product.rating.toFixed(1)
                                        }}</span>
                                        ({{ product.reviewCount }} avis)
                                    </span>
                                    <span v-if="product.sku" class="font-mono text-xs text-zinc-500"
                                        >Réf. {{ product.sku }}</span
                                    >
                                </div>
                            </div>

                            <p v-if="summary" class="leading-relaxed text-zinc-400">
                                {{ summary }}
                            </p>

                            <div class="rounded-3xl border border-zinc-800 bg-zinc-900/60 p-6">
                                <div class="flex flex-wrap items-baseline gap-3">
                                    <span class="text-4xl font-bold text-white">{{
                                        formatPrice(product.price)
                                    }}</span>
                                    <span
                                        v-if="discount > 0"
                                        class="text-lg text-zinc-500 line-through"
                                        >{{ formatPrice(product.oldPrice) }}</span
                                    >
                                </div>
                                <p class="mt-1 text-xs text-zinc-500">TTC</p>

                                <p
                                    class="mt-5 flex items-center gap-2 text-sm font-medium"
                                    :class="stockInfo.tone"
                                >
                                    <span class="h-2 w-2 rounded-full" :class="stockInfo.dot" />
                                    {{ stockInfo.label }}
                                </p>

                                <button
                                    type="button"
                                    class="btn btn-primary mt-6 w-full py-4 text-base"
                                    :disabled="product.stock <= 0"
                                    @click="cartNotice = true"
                                >
                                    <AppIcon name="bag" class="h-5 w-5" />
                                    {{ product.stock > 0 ? "Ajouter au panier" : "Indisponible" }}
                                </button>
                                <p
                                    v-if="cartNotice"
                                    class="mt-3 rounded-xl bg-zinc-800/80 px-4 py-3 text-sm text-zinc-300"
                                    role="status"
                                >
                                    Le panier n'est pas encore disponible : il arrive très bientôt.
                                </p>
                            </div>

                            <!-- Aperçu des caractéristiques -->
                            <dl
                                v-if="specs.length"
                                class="grid grid-cols-2 gap-3"
                            >
                                <div
                                    v-for="spec in specs.slice(0, 4)"
                                    :key="spec.key"
                                    class="rounded-2xl border border-zinc-800 bg-zinc-900/40 px-4 py-3"
                                >
                                    <dt class="text-xs text-zinc-500">{{ spec.label }}</dt>
                                    <dd class="mt-0.5 truncate font-semibold text-zinc-100">
                                        {{ spec.value }}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                <!-- Description & fiche technique -->
                <div class="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-14">
                    <section class="lg:col-span-7">
                        <h2 class="text-2xl font-bold text-white">Description</h2>
                        <p
                            v-if="product.description"
                            class="mt-4 whitespace-pre-line leading-relaxed text-zinc-400"
                        >
                            {{ product.description }}
                        </p>
                        <p v-else class="mt-4 text-zinc-500">
                            Aucune description n'est disponible pour ce produit.
                        </p>
                    </section>

                    <section v-if="specs.length" class="lg:col-span-5">
                        <h2 class="text-2xl font-bold text-white">Fiche technique</h2>
                        <dl
                            class="mt-4 divide-y divide-zinc-800 overflow-hidden rounded-2xl border border-zinc-800"
                        >
                            <div
                                v-for="spec in specs"
                                :key="spec.key"
                                class="flex justify-between gap-6 bg-zinc-900/40 px-5 py-3.5 text-sm odd:bg-zinc-900/70"
                            >
                                <dt class="text-zinc-400">{{ spec.label }}</dt>
                                <dd class="text-right font-medium text-zinc-100">
                                    {{ spec.value }}
                                </dd>
                            </div>
                        </dl>
                    </section>
                </div>
            </div>

            <!-- Produits similaires -->
            <section v-if="related.length" class="border-t border-zinc-800/80 bg-zinc-900/30 py-16">
                <div class="container-page">
                    <div class="mb-8 flex items-end justify-between gap-4">
                        <h2 class="text-2xl font-bold text-white">
                            Dans la même catégorie
                        </h2>
                        <RouterLink
                            :to="{ name: 'products', params: { category: product.category } }"
                            class="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300"
                        >
                            Tout voir <AppIcon name="arrowRight" class="h-4 w-4" />
                        </RouterLink>
                    </div>
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <ProductCard v-for="p in related" :key="p._id" :product="p" />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
