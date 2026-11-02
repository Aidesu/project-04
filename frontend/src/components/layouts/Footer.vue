<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { api } from "@/api/client";
import AppIcon from "@/components/AppIcon.vue";
import { useCategories } from "@/composables/useCategories";
import type { ApiStatus } from "@/types";

const { categories } = useCategories();

const status = ref<ApiStatus | null>(null);
const checking = ref(true);

async function checkStatus() {
    checking.value = true;
    try {
        status.value = await api.getStatus();
    } catch {
        status.value = null;
    } finally {
        checking.value = false;
    }
}

onMounted(checkStatus);

const indicator = computed(() => {
    if (checking.value)
        return { label: "Vérification…", dot: "bg-amber-400 animate-pulse" };
    if (!status.value) return { label: "API injoignable", dot: "bg-rose-500" };
    if (status.value.db_state !== "connected")
        return {
            label: `Base de données : ${status.value.db_state}`,
            dot: "bg-amber-400",
        };
    return { label: "Tous les systèmes opérationnels", dot: "bg-emerald-400" };
});

const year = new Date().getFullYear();
</script>

<template>
    <footer class="mt-24 border-t border-zinc-800/80 bg-zinc-950">
        <div class="container-page grid gap-10 py-12 md:grid-cols-3">
            <div class="space-y-3">
                <div class="flex items-center gap-2.5">
                    <span
                        class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                    >
                        <AppIcon name="cpu" class="h-5 w-5" />
                    </span>
                    <span class="font-bold text-white">Project-04</span>
                </div>
                <p class="max-w-xs text-sm text-zinc-400">
                    Composants, serveurs et équipements professionnels.
                </p>
            </div>

            <div>
                <h2
                    class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                    Catalogue
                </h2>
                <ul class="grid grid-cols-2 gap-2 text-sm">
                    <li v-for="cat in categories" :key="cat._id">
                        <RouterLink
                            :to="{
                                name: 'products',
                                params: { category: cat.slug },
                            }"
                            class="text-zinc-400 transition hover:text-white"
                            >{{ cat.name }}</RouterLink
                        >
                    </li>
                    <li>
                        <RouterLink
                            to="/products"
                            class="text-zinc-400 transition hover:text-white"
                            >Tout voir</RouterLink
                        >
                    </li>
                </ul>
            </div>

            <div class="md:justify-self-end">
                <h2
                    class="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500"
                >
                    État du service
                </h2>
                <button
                    type="button"
                    class="inline-flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:border-zinc-700"
                    title="Cliquer pour revérifier"
                    @click="checkStatus"
                >
                    <span class="h-2 w-2 rounded-full" :class="indicator.dot" />
                    {{ indicator.label }}
                </button>
            </div>
        </div>
        <div class="border-t border-zinc-900">
            <p class="container-page py-6 text-xs text-zinc-500">
                © {{ year }} The Deafiaa Space Company. Tous droits réservés.
            </p>
        </div>
    </footer>
</template>
