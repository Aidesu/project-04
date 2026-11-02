<script setup lang="ts">
import { onMounted, ref } from "vue";
import { api, errorMessage } from "@/api/client";
import AppIcon from "@/components/AppIcon.vue";
import type { IconName } from "@/components/icons";
import ProductCard from "@/components/ProductCard.vue";
import ProductCardSkeleton from "@/components/ProductCardSkeleton.vue";
import StateMessage from "@/components/StateMessage.vue";
import { useCategories } from "@/composables/useCategories";
import type { Product } from "@/types";

const {
    categories,
    loading: loadingCategories,
    error: categoriesError,
    reload: reloadCategories,
} = useCategories();

const latest = ref<Product[]>([]);
const loadingLatest = ref(true);
const latestError = ref<string | null>(null);

async function loadLatest() {
    loadingLatest.value = true;
    latestError.value = null;
    try {
        latest.value = await api.getProducts({ limit: 8 });
    } catch (e) {
        latestError.value = errorMessage(e);
    } finally {
        loadingLatest.value = false;
    }
}

onMounted(loadLatest);

const highlights: { icon: IconName; title: string; text: string }[] = [
    {
        icon: "shield",
        title: "Fiches techniques détaillées",
        text: "Toutes les caractéristiques pour comparer en connaissance de cause.",
    },
    {
        icon: "bolt",
        title: "Stock affiché en temps réel",
        text: "Vous savez immédiatement ce qui est disponible.",
    },
    {
        icon: "wrench",
        title: "Du composant au serveur",
        text: "Pièces détachées comme équipements professionnels complets.",
    },
];
</script>

<template>
    <div>
        <!-- HERO -->
        <section class="relative isolate overflow-hidden">
            <div
                class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.25),transparent)]"
            />
            <div
                class="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
            />

            <div class="container-page py-20 text-center sm:py-28">
                <span
                    class="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300"
                >
                    <AppIcon name="cpu" class="h-3.5 w-3.5" />
                    Matériel informatique & solutions serveur
                </span>
                <h1
                    class="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-6xl"
                >
                    Le bon matériel pour
                    <span
                        class="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent"
                        >chaque projet.</span
                    >
                </h1>
                <p
                    class="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg"
                >
                    Processeurs, cartes graphiques, stockage, réseau et serveurs :
                    comparez les caractéristiques et trouvez la pièce qui convient
                    à votre configuration.
                </p>
                <div
                    class="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
                >
                    <RouterLink to="/products" class="btn btn-primary px-7 py-3.5">
                        Explorer le catalogue
                        <AppIcon name="arrowRight" class="h-4 w-4" />
                    </RouterLink>
                    <a href="#nouveautes" class="btn btn-ghost px-7 py-3.5"
                        >Voir les nouveautés</a
                    >
                </div>
            </div>
        </section>

        <!-- ATOUTS -->
        <section class="container-page">
            <ul class="grid gap-4 sm:grid-cols-3">
                <li
                    v-for="item in highlights"
                    :key="item.title"
                    class="flex gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5"
                >
                    <span
                        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400"
                    >
                        <AppIcon :name="item.icon" class="h-5 w-5" />
                    </span>
                    <div>
                        <h2 class="text-sm font-semibold text-white">
                            {{ item.title }}
                        </h2>
                        <p class="mt-1 text-sm text-zinc-400">{{ item.text }}</p>
                    </div>
                </li>
            </ul>
        </section>

        <!-- CATÉGORIES -->
        <section class="container-page mt-20">
            <div class="mb-8 flex items-end justify-between gap-4">
                <div>
                    <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Parcourir par catégorie
                    </h2>
                    <p class="mt-2 text-zinc-400">
                        Trouvez rapidement le type de matériel recherché.
                    </p>
                </div>
                <RouterLink
                    to="/products"
                    class="hidden shrink-0 items-center gap-1 text-sm font-semibold text-indigo-400 hover:text-indigo-300 sm:inline-flex"
                >
                    Tout voir <AppIcon name="arrowRight" class="h-4 w-4" />
                </RouterLink>
            </div>

            <div
                v-if="loadingCategories && !categories.length"
                class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
            >
                <div v-for="n in 6" :key="n" class="skeleton h-28 rounded-2xl" />
            </div>

            <StateMessage
                v-else-if="categoriesError"
                tone="error"
                icon="warning"
                title="Catégories indisponibles"
                :message="categoriesError"
            >
                <button class="btn btn-ghost" @click="reloadCategories">
                    <AppIcon name="refresh" class="h-4 w-4" /> Réessayer
                </button>
            </StateMessage>

            <div
                v-else-if="categories.length"
                class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
            >
                <RouterLink
                    v-for="cat in categories.slice(0, 6)"
                    :key="cat._id"
                    :to="{ name: 'products', params: { category: cat.slug } }"
                    class="group flex flex-col justify-between gap-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5 transition hover:-translate-y-0.5 hover:border-indigo-500/50 hover:bg-zinc-900"
                >
                    <AppIcon
                        name="grid"
                        class="h-6 w-6 text-zinc-500 transition group-hover:text-indigo-400"
                    />
                    <div>
                        <p class="font-semibold text-white">{{ cat.name }}</p>
                        <p class="text-xs text-zinc-500">
                            {{ cat.itemCount }} produit{{ cat.itemCount > 1 ? "s" : "" }}
                        </p>
                    </div>
                </RouterLink>
            </div>
        </section>

        <!-- NOUVEAUTÉS -->
        <section id="nouveautes" class="container-page mt-20 scroll-mt-24">
            <div class="mb-8">
                <h2 class="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    Derniers arrivages
                </h2>
                <p class="mt-2 text-zinc-400">
                    Les produits ajoutés le plus récemment au catalogue.
                </p>
            </div>

            <div
                v-if="loadingLatest"
                class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                <ProductCardSkeleton v-for="n in 4" :key="n" />
            </div>

            <StateMessage
                v-else-if="latestError"
                tone="error"
                icon="warning"
                title="Impossible de charger les produits"
                :message="latestError"
            >
                <button class="btn btn-ghost" @click="loadLatest">
                    <AppIcon name="refresh" class="h-4 w-4" /> Réessayer
                </button>
            </StateMessage>

            <StateMessage
                v-else-if="!latest.length"
                icon="bag"
                title="Le catalogue est vide pour l'instant"
                message="Les produits apparaîtront ici dès qu'ils seront ajoutés."
            />

            <div
                v-else
                class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
                <ProductCard v-for="p in latest" :key="p._id" :product="p" />
            </div>
        </section>

        <!-- CONFIGURATEUR (à venir) -->
        <section class="container-page mt-20">
            <div
                class="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-indigo-500/15 via-zinc-900 to-zinc-900 p-8 sm:p-12"
            >
                <span
                    class="rounded-full bg-zinc-800 px-3 py-1 text-xs font-medium text-zinc-300"
                    >Bientôt disponible</span
                >
                <h2 class="mt-4 max-w-xl text-2xl font-bold text-white sm:text-3xl">
                    Configurateur PC avec vérification de compatibilité
                </h2>
                <p class="mt-3 max-w-xl text-zinc-400">
                    Choisissez un processeur, nous filtrerons automatiquement les
                    cartes mères, la mémoire et l'alimentation compatibles.
                </p>
                <AppIcon
                    name="cpu"
                    class="pointer-events-none absolute -bottom-10 -right-10 hidden h-64 w-64 text-indigo-500/10 sm:block"
                />
            </div>
        </section>
    </div>
</template>
