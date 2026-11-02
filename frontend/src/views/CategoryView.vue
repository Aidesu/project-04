<script setup lang="ts">
import AppIcon from "@/components/AppIcon.vue";
import StateMessage from "@/components/StateMessage.vue";
import { useCategories } from "@/composables/useCategories";

const { categories, loading, error, reload } = useCategories();
</script>

<template>
    <div class="container-page py-12 sm:py-16">
        <header class="mb-10 max-w-2xl">
            <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Catalogue
            </h1>
            <p class="mt-3 text-zinc-400">
                Sélectionnez une catégorie, ou
                <RouterLink
                    :to="{ name: 'search' }"
                    class="font-medium text-indigo-400 hover:text-indigo-300"
                    >parcourez tous les produits</RouterLink
                >.
            </p>
        </header>

        <div
            v-if="loading && !categories.length"
            class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
            <div v-for="n in 6" :key="n" class="skeleton h-56 rounded-2xl" />
        </div>

        <StateMessage
            v-else-if="error"
            tone="error"
            icon="warning"
            title="Impossible de charger les catégories"
            :message="error"
        >
            <button class="btn btn-ghost" @click="reload">
                <AppIcon name="refresh" class="h-4 w-4" /> Réessayer
            </button>
        </StateMessage>

        <StateMessage
            v-else-if="!categories.length"
            icon="grid"
            title="Aucune catégorie pour le moment"
            message="Les catégories apparaîtront ici dès qu'elles seront créées."
        />

        <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <RouterLink
                v-for="cat in categories"
                :key="cat._id"
                :to="{ name: 'products', params: { category: cat.slug } }"
                class="group relative block h-56 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-700 hover:shadow-2xl hover:shadow-indigo-500/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
                <img
                    v-if="cat.image"
                    :src="cat.image"
                    alt=""
                    loading="lazy"
                    class="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                    v-else
                    class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/15 via-zinc-900 to-zinc-900"
                >
                    <AppIcon
                        name="cpu"
                        class="h-24 w-24 text-zinc-800 transition group-hover:text-indigo-500/20"
                    />
                </div>
                <div
                    class="absolute inset-0 bg-gradient-to-t from-zinc-950/95 via-zinc-950/40 to-transparent"
                />

                <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                    <div>
                        <h2 class="text-xl font-bold text-white">{{ cat.name }}</h2>
                        <p class="mt-1 text-sm text-zinc-300">
                            {{ cat.itemCount }} produit{{ cat.itemCount > 1 ? "s" : "" }}
                        </p>
                    </div>
                    <span
                        class="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white backdrop-blur transition group-hover:border-transparent group-hover:bg-indigo-500"
                    >
                        <AppIcon name="arrowRight" class="h-4 w-4" />
                    </span>
                </div>
            </RouterLink>
        </div>
    </div>
</template>
