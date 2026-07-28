<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    iconPath?: string;
    itemCount?: number;
}

interface ApiResponse {
    status: string;
    db_state: string;
}

// État réactif pour les catégories
const categories = ref<Category[]>([]);
const loadingCategories = ref(true);
const categoriesError = ref<string | null>(null);

// État réactif pour le status API / DB
const apiData = ref<ApiResponse | null>(null);
const loadingStatus = ref(true);
const statusError = ref<string | null>(null);

// Chargement des catégories
const fetchCategories = async () => {
    loadingCategories.value = true;
    categoriesError.value = null;

    try {
        const response = await axios.get<Category[]>(
            "http://localhost:3000/api/categories",
        );
        categories.value = response.data;
    } catch (e) {
        console.error("Erreur lors de la récupération des catégories", e);
        categoriesError.value = "Impossible de charger les catégories.";
    } finally {
        loadingCategories.value = false;
    }
};

// Chargement de l'état système
const fetchSystemStatus = async () => {
    loadingStatus.value = true;
    statusError.value = null;

    try {
        const response = await axios.get<ApiResponse>(
            "http://localhost:3000/api/status",
            { timeout: 5000 },
        );
        apiData.value = response.data;
    } catch (e) {
        console.error("System status check failed.");
        statusError.value = "Backend injoignable";
    } finally {
        loadingStatus.value = false;
    }
};

onMounted(() => {
    fetchCategories();
    fetchSystemStatus();
});
</script>

<template>
    <div
        class="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100 flex flex-col"
    >
        <!-- HEADER SECTION -->
        <header
            class="relative pt-24 pb-12 overflow-hidden flex items-center justify-center text-center px-4 sm:px-6"
        >
            <div
                class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-gray-50 transition-colors duration-300 dark:from-indigo-900/20 dark:via-zinc-950 dark:to-zinc-950"
            ></div>
            <div class="max-w-4xl mx-auto space-y-6">
                <h1
                    class="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 transition-colors dark:text-white"
                >
                    Explorez notre
                    <span
                        class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                    >
                        Catalogue
                    </span>
                </h1>
                <p
                    class="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed transition-colors dark:text-zinc-400"
                >
                    Sélectionnez une catégorie pour découvrir nos composants
                    triés sur le volet. Qualité et compatibilité garanties.
                </p>
            </div>
        </header>

        <!-- MAIN CATEGORIES GRID -->
        <main class="flex-grow pb-24">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <!-- Chargement catégories -->
                <div
                    v-if="loadingCategories"
                    class="text-center py-12 text-gray-500 dark:text-zinc-400"
                >
                    Chargement des catégories...
                </div>

                <!-- Erreur catégories -->
                <div
                    v-else-if="categoriesError"
                    class="text-center py-12 text-red-500"
                >
                    {{ categoriesError }}
                </div>

                <!-- Liste des cartes -->
                <div
                    v-else
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                    <!-- IMAGE CARD -->
                    <a
                        v-for="category in categories"
                        :key="category._id"
                        :href="`/products/${category.slug || category._id}`"
                        class="group relative h-90 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-950 block"
                    >
                        <div
                            class="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
                            :style="{
                                backgroundImage: `url(${category.image || 'https://via.placeholder.com/800x600?text=No+Image'})`,
                            }"
                        ></div>
                        <div
                            class="absolute inset-0 bg-gradient-to-t from-gray-900/95 via-gray-900/40 to-transparent transition-opacity duration-300 group-hover:from-gray-900"
                        ></div>
                        <div
                            class="absolute inset-0 p-6 flex flex-col justify-end"
                        >
                            <div class="flex items-end justify-between gap-4">
                                <div>
                                    <h3
                                        class="text-2xl font-bold text-white mb-1 drop-shadow-md group-hover:text-indigo-300 transition-colors"
                                    >
                                        {{ category.name }}
                                    </h3>
                                    <span
                                        class="text-sm font-medium text-gray-300 flex items-center gap-1 group-hover:text-white transition-colors"
                                    >
                                        {{ category.itemCount || 0 }} produits
                                        <span
                                            class="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300"
                                            aria-hidden="true"
                                            >&rarr;</span
                                        >
                                    </span>
                                </div>
                                <div
                                    v-if="category.iconPath"
                                    class="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex shrink-0 items-center justify-center text-white border border-white/20 group-hover:bg-indigo-600 group-hover:border-transparent transition-all duration-300"
                                >
                                    <svg
                                        class="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        aria-hidden="true"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            :d="category.iconPath"
                                        ></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
            </div>
        </main>

        <!-- FOOTER & SYSTEM STATUS -->
        <footer
            class="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 transition-colors duration-300 dark:bg-zinc-950 dark:border-zinc-800 mt-auto"
        >
            <div
                class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6"
            >
                <div class="flex items-center gap-2">
                    <div
                        class="w-6 h-6 bg-gray-700 rounded flex items-center justify-center text-white font-bold text-xs dark:bg-zinc-800"
                    >
                        P4
                    </div>
                    <span class="font-medium text-gray-300 dark:text-zinc-400">
                        © 2026 The Deafiaa Space Company. Tous droits réservés.
                    </span>
                </div>

                <div
                    class="flex items-center bg-gray-800 px-4 py-2 rounded-full text-sm border border-gray-700 transition-colors dark:bg-zinc-900 dark:border-zinc-800"
                >
                    <span
                        class="mr-3 font-medium text-gray-300 dark:text-zinc-400"
                        >System Status:</span
                    >
                    <div
                        v-if="loadingStatus"
                        class="flex items-center gap-2 text-yellow-500"
                    >
                        <div
                            class="w-2 h-2 rounded-full bg-yellow-500 animate-ping"
                        ></div>
                        Connecting...
                    </div>
                    <div
                        v-else-if="statusError"
                        class="flex items-center gap-2 text-red-400"
                    >
                        <div class="w-2 h-2 rounded-full bg-red-500"></div>
                        {{ statusError }}
                    </div>
                    <div v-else-if="apiData" class="flex items-center gap-4">
                        <div
                            class="flex items-center gap-2 text-green-400"
                            title="API Online"
                        >
                            <div
                                class="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"
                            ></div>
                            API: {{ apiData.status }}
                        </div>
                        <div class="text-gray-500 text-xs dark:text-zinc-600">
                            |
                        </div>
                        <div class="text-green-400" title="Database Online">
                            DB: {{ apiData.db_state }}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    </div>
</template>
