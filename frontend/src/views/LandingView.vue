<script setup lang="ts">
import { ref, onMounted } from "vue";
import axios from "axios";

interface ApiResponse {
    status: string;
    db_state: string;
}

const apiData = ref<ApiResponse | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await axios.get<ApiResponse>(
            "http://localhost:3000/api/status",
        );
        apiData.value = response.data;
    } catch (e) {
        console.error(e);
        error.value = "Backend injoignable";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>

<template>
    <div
        class="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 font-sans selection:bg-indigo-500 selection:text-white dark:bg-zinc-950 dark:text-zinc-100"
    >
        <main>
            <section
                class="relative pt-24 pb-32 overflow-hidden flex items-center justify-center text-center px-4 sm:px-6"
            >
                <div
                    class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-gray-50 transition-colors duration-300 dark:from-indigo-900/20 dark:via-zinc-950 dark:to-zinc-950"
                ></div>

                <div class="max-w-4xl mx-auto space-y-8">
                    <h1
                        class="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 transition-colors dark:text-white"
                    >
                        Créez la machine de
                        <span
                            class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400"
                            >vos rêves.</span
                        >
                    </h1>
                    <p
                        class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed transition-colors dark:text-zinc-400"
                    >
                        Utilisez notre configurator pour assembler votre setup
                        sur mesure avec une compatibilité garantie, ou parcourez
                        notre boutique pour trouver les meilleures pièces au
                        détail.
                    </p>

                    <div
                        class="flex flex-col sm:flex-row gap-4 justify-center pt-4"
                    >
                        <button
                            class="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-xl hover:shadow-indigo-200 hover:-translate-y-1 dark:bg-indigo-500 dark:hover:bg-indigo-400 dark:shadow-none"
                        >
                            Lancer le configurator
                        </button>
                        <button
                            class="bg-white border-2 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 text-gray-800 px-8 py-4 rounded-full text-lg font-bold transition-all shadow-sm dark:bg-transparent dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-indigo-400 dark:hover:text-indigo-400"
                        >
                            Explorer la Boutique
                        </button>
                    </div>
                </div>
            </section>

            <section
                class="py-20 bg-white transition-colors duration-300 dark:bg-zinc-950"
            >
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="grid md:grid-cols-2 gap-12">
                        <div
                            class="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group dark:bg-zinc-900/50 dark:border-zinc-800/50 dark:hover:border-zinc-700"
                        >
                            <div
                                class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform dark:bg-indigo-500/10"
                            >
                                <svg
                                    class="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    ></path>
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    ></path>
                                </svg>
                            </div>
                            <h3
                                class="text-2xl font-bold mb-3 transition-colors dark:text-white"
                            >
                                Configurateur Intelligent
                            </h3>
                            <p
                                class="text-gray-600 mb-6 transition-colors dark:text-zinc-400"
                            >
                                Choisissez un processeur, nous filtrons
                                automatiquement les cartes mères compatibles. Un
                                système anti-erreur pour un montage parfait.
                            </p>
                            <a
                                href="#"
                                class="text-indigo-600 font-bold hover:underline flex items-center gap-1 dark:text-indigo-400"
                            >
                                Essayer maintenant
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                        <div
                            class="p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl transition-all duration-300 group dark:bg-zinc-900/50 dark:border-zinc-800/50 dark:hover:border-zinc-700"
                        >
                            <div
                                class="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform dark:bg-purple-500/10"
                            >
                                <svg
                                    class="w-7 h-7 text-purple-600 dark:text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    ></path>
                                </svg>
                            </div>
                            <h3
                                class="text-2xl font-bold mb-3 transition-colors dark:text-white"
                            >
                                Boutique & Composants
                            </h3>
                            <p
                                class="text-gray-600 mb-6 transition-colors dark:text-zinc-400"
                            >
                                Un catalogue riche des meilleures marques.
                            </p>
                            <a
                                href="#"
                                class="text-purple-600 font-bold hover:underline flex items-center gap-1 dark:text-purple-400"
                            >
                                Voir le catalogue
                                <span aria-hidden="true">&rarr;</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- FOOTER & SYSTEM STATUS -->
        <footer
            class="bg-gray-900 text-gray-400 py-12 border-t border-gray-800 transition-colors duration-300 dark:bg-zinc-950 dark:border-zinc-800"
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
                    <span class="font-medium text-gray-300 dark:text-zinc-400"
                        >© 2026 The Deafiaa Space Company. Tous droits
                        réservés.</span
                    >
                </div>
                <div
                    class="flex items-center bg-gray-800 px-4 py-2 rounded-full text-sm border border-gray-700 transition-colors dark:bg-zinc-900 dark:border-zinc-800"
                >
                    <span
                        class="mr-3 font-medium text-gray-300 dark:text-zinc-400"
                        >System Status:</span
                    >

                    <div
                        v-if="loading"
                        class="flex items-center gap-2 text-yellow-500"
                    >
                        <div
                            class="w-2 h-2 rounded-full bg-yellow-500 animate-ping"
                        ></div>
                        Connecting...
                    </div>

                    <div
                        v-else-if="error"
                        class="flex items-center gap-2 text-red-400"
                    >
                        <div class="w-2 h-2 rounded-full bg-red-500"></div>
                        {{ error }}
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
