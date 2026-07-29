<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import axios from "axios";

interface Product {
    _id: string;
    name: string;
    slug: string;
    category: string;
    brand: string;
    price: number;
    oldPrice?: number;
    stock: number;
    images: string[];
    description?: string;
    featured?: boolean;
    bestSeller?: boolean;
}

const route = useRoute();

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const search = ref("");

const category = computed(() => route.params.category as string);

const fetchProducts = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await axios.get<Product[]>(
            "http://localhost:3000/api/products",
            {
                params: {
                    category: category.value,
                    search: search.value || undefined,
                },
            },
        );

        products.value = response.data;
    } catch (e) {
        console.error(e);
        error.value = "Impossible de charger les produits";
    } finally {
        loading.value = false;
    }
};

watch(search, fetchProducts);
watch(() => route.params.category, fetchProducts);

onMounted(fetchProducts);
</script>

<template>
    <div class="min-h-screen bg-gray-50 dark:bg-zinc-950">
        <section class="py-16 px-4 sm:px-6 lg:px-8">
            <div class="max-w-7xl mx-auto">
                <div
                    class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
                >
                    <div>
                        <h1
                            class="text-4xl font-bold text-gray-900 dark:text-white capitalize"
                        >
                            {{ category }}
                        </h1>
                        <p class="text-gray-600 dark:text-zinc-400 mt-2">
                            {{ products.length }} produit(s) trouvé(s)
                        </p>
                    </div>

                    <div class="w-full md:w-96">
                        <input
                            v-model="search"
                            type="text"
                            placeholder="Rechercher un produit..."
                            class="w-full rounded-xl border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                        />
                    </div>
                </div>

                <div
                    v-if="loading"
                    class="text-center py-20 text-gray-500 dark:text-zinc-400"
                >
                    Chargement des produits...
                </div>

                <div v-else-if="error" class="text-center py-20 text-red-500">
                    {{ error }}
                </div>

                <div
                    v-else
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    <router-link
                        v-for="product in products"
                        :key="product._id"
                        :to="`/product/${product.slug}`"
                        class="group bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >
                        <div
                            class="relative aspect-square overflow-hidden bg-gray-100 dark:bg-zinc-800"
                        >
                            <img
                                :src="
                                    product.images?.[0] ||
                                    'https://via.placeholder.com/600x600?text=Product'
                                "
                                :alt="product.name"
                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />

                            <div
                                v-if="product.bestSeller"
                                class="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded-full"
                            >
                                Best Seller
                            </div>
                        </div>

                        <div class="p-5 space-y-3">
                            <div
                                class="text-sm text-indigo-600 dark:text-indigo-400 font-medium"
                            >
                                {{ product.brand }}
                            </div>

                            <h3
                                class="font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors"
                            >
                                {{ product.name }}
                            </h3>

                            <div class="flex items-center gap-2">
                                <span
                                    class="text-2xl font-bold text-gray-900 dark:text-white"
                                >
                                    ${{ product.price.toFixed(2) }}
                                </span>

                                <span
                                    v-if="product.oldPrice"
                                    class="text-sm text-gray-500 line-through"
                                >
                                    ${{ product.oldPrice.toFixed(2) }}
                                </span>
                            </div>

                            <div class="flex items-center justify-between pt-2">
                                <span
                                    class="text-sm font-medium"
                                    :class="
                                        product.stock > 0
                                            ? 'text-green-600'
                                            : 'text-red-500'
                                    "
                                >
                                    {{
                                        product.stock > 0
                                            ? "En stock"
                                            : "Rupture"
                                    }}
                                </span>

                                <button
                                    class="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors"
                                >
                                    Voir
                                </button>
                            </div>
                        </div>
                    </router-link>
                </div>
            </div>
        </section>
    </div>
</template>
