<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";

interface Product {
    _id: string;
    name: string;
    slug: string;
    category: string;
    brand: string;
    sku: string;
    description: string;
    shortDescription: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    images: string[];
    specifications: Record<string, any>;
    rating: number;
    reviewCount: number;
    featured: boolean;
    bestSeller: boolean;
    isNew: boolean;
    active: boolean;
}

const route = useRoute();
const router = useRouter();

const product = ref<Product | null>(null);
const relatedProducts = ref<Product[]>([]);
const activeImage = ref<string>("");

// UI States
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref("");

const API_BASE_URL = "http://localhost:3000/api";
const PLACEHOLDER_IMG =
    "https://placehold.co/800x800/f3f4f6/a1a1aa?text=No+Image";

// Computed properties for UI logic
const discountPercentage = computed(() => {
    if (
        product.value?.oldPrice &&
        product.value.price < product.value.oldPrice
    ) {
        return Math.round(
            ((product.value.oldPrice - product.value.price) /
                product.value.oldPrice) *
                100,
        );
    }
    return 0;
});

const isOutOfStock = computed(() => (product.value?.stock || 0) <= 0);

// Main fetch function
const fetchProduct = async () => {
    try {
        isLoading.value = true;
        const response = await axios.get<Product>(
            `${API_BASE_URL}/products/${route.params.slug}`,
        );

        product.value = response.data;
        activeImage.value = response.data.images?.[0] || PLACEHOLDER_IMG;

        await fetchRelatedProducts(response.data.category, response.data._id);
    } catch (error: any) {
        hasError.value = true;
        errorMessage.value =
            error.response?.status === 404
                ? "Ce produit est introuvable."
                : "Une erreur est survenue lors du chargement du produit.";
    } finally {
        isLoading.value = false;
    }
};

// Fetch recommendations
const fetchRelatedProducts = async (category: string, currentId: string) => {
    try {
        const response = await axios.get<Product[]>(
            `${API_BASE_URL}/products?category=${category}&limit=5`,
        );
        const filtered = response.data
            .filter((p) => p._id !== currentId)
            .slice(0, 4);

        // If API returns empty, use mock data so the UI section is still visible
        if (filtered.length === 0) {
            loadMockRecommendations();
        } else {
            relatedProducts.value = filtered;
        }
    } catch (error) {
        loadMockRecommendations(); // Fallback on error
    }
};

// Fallback data to ensure the UI design is always visible
const loadMockRecommendations = () => {
    relatedProducts.value = [
        {
            _id: "1",
            name: "Produit Similaire Alpha",
            brand: "Marque X",
            price: 129.99,
            images: [
                "https://placehold.co/400x400/f8fafc/a1a1aa?text=Produit+1",
            ],
            slug: "alpha",
        } as Product,
        {
            _id: "2",
            name: "Accessoire Compatible",
            brand: "Marque Y",
            price: 49.99,
            oldPrice: 59.99,
            images: [
                "https://placehold.co/400x400/f8fafc/a1a1aa?text=Produit+2",
            ],
            slug: "accessoire",
        } as Product,
        {
            _id: "3",
            name: "Version Premium Pro",
            brand: "Marque X",
            price: 299.99,
            images: [
                "https://placehold.co/400x400/f8fafc/a1a1aa?text=Produit+3",
            ],
            slug: "premium",
        } as Product,
        {
            _id: "4",
            name: "Produit Alternatif",
            brand: "Marque Z",
            price: 89.0,
            images: [
                "https://placehold.co/400x400/f8fafc/a1a1aa?text=Produit+4",
            ],
            slug: "alternatif",
        } as Product,
    ];
};

onMounted(() => {
    fetchProduct();
});
</script>

<template>
    <div
        class="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans selection:bg-indigo-500 selection:text-white"
    >
        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center h-screen">
            <div
                class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"
            ></div>
        </div>

        <!-- Error State -->
        <div
            v-else-if="hasError"
            class="min-h-screen flex items-center justify-center"
        >
            <div
                class="max-w-md text-center p-8 bg-white dark:bg-zinc-900 rounded-3xl shadow-xl"
            >
                <div class="text-red-500 mb-6 flex justify-center">
                    <svg
                        class="w-16 h-16"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="1.5"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                </div>
                <h2
                    class="text-3xl font-bold text-gray-900 dark:text-white mb-4"
                >
                    Oups !
                </h2>
                <p class="text-gray-500 dark:text-zinc-400 mb-8">
                    {{ errorMessage }}
                </p>
                <button
                    @click="router.push('/')"
                    class="w-full py-4 rounded-2xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                    Retour à l'accueil
                </button>
            </div>
        </div>

        <!-- Main Content -->
        <div v-else-if="product">
            <!-- Top Section: Product Details -->
            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                <!-- Breadcrumb -->
                <nav
                    class="flex text-sm text-gray-500 dark:text-zinc-400 mb-10 font-medium"
                >
                    <ol class="flex items-center space-x-3">
                        <li>
                            <router-link
                                to="/"
                                class="hover:text-indigo-600 transition-colors"
                                >Accueil</router-link
                            >
                        </li>
                        <li>
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </li>
                        <li>
                            <span
                                class="hover:text-indigo-600 cursor-pointer transition-colors"
                                >{{ product.category }}</span
                            >
                        </li>
                        <li>
                            <svg
                                class="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </li>
                        <li
                            class="text-gray-900 dark:text-zinc-100 truncate max-w-[150px] sm:max-w-none"
                        >
                            {{ product.name }}
                        </li>
                    </ol>
                </nav>

                <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
                    <!-- Left Column: Gallery -->
                    <div class="lg:col-span-7 flex flex-col gap-6">
                        <!-- Main Image -->
                        <div
                            class="relative bg-white dark:bg-zinc-900 rounded-[2rem] p-6 shadow-sm border border-gray-100 dark:border-zinc-800 aspect-[4/3] flex items-center justify-center group overflow-hidden"
                        >
                            <div
                                class="absolute top-6 left-6 flex flex-col gap-2 z-10"
                            >
                                <span
                                    v-if="product.isNew"
                                    class="bg-indigo-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider"
                                    >Nouveau</span
                                >
                                <span
                                    v-if="product.bestSeller"
                                    class="bg-amber-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider"
                                    >Meilleure Vente</span
                                >
                                <span
                                    v-if="discountPercentage > 0"
                                    class="bg-rose-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider"
                                    >-{{ discountPercentage }}%</span
                                >
                            </div>
                            <img
                                :src="activeImage"
                                :alt="product.name"
                                class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>

                        <!-- Thumbnails -->
                        <div
                            v-if="product.images && product.images.length > 1"
                            class="grid grid-cols-4 sm:grid-cols-6 gap-4"
                        >
                            <button
                                v-for="(img, index) in product.images"
                                :key="index"
                                @click="activeImage = img"
                                class="relative rounded-2xl overflow-hidden aspect-square border-2 transition-all duration-200 bg-white dark:bg-zinc-900"
                                :class="
                                    activeImage === img
                                        ? 'border-indigo-600 ring-4 ring-indigo-100 dark:ring-indigo-900/30'
                                        : 'border-transparent hover:border-gray-300 dark:hover:border-zinc-700 shadow-sm'
                                "
                            >
                                <img
                                    :src="img"
                                    alt="Thumbnail"
                                    class="w-full h-full object-cover p-2"
                                />
                            </button>
                        </div>
                    </div>

                    <!-- Right Column: Info (Sticky on scroll) -->
                    <div class="lg:col-span-5 relative">
                        <div class="sticky top-10 flex flex-col gap-8">
                            <!-- Header Info -->
                            <div>
                                <p
                                    class="text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-sm mb-3"
                                >
                                    {{ product.brand }}
                                </p>
                                <h1
                                    class="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-4"
                                >
                                    {{ product.name }}
                                </h1>

                                <div class="flex items-center gap-4 text-sm">
                                    <div
                                        v-if="product.reviewCount > 0"
                                        class="flex items-center text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full"
                                    >
                                        <svg
                                            class="w-4 h-4 fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                                            />
                                        </svg>
                                        <span
                                            class="ml-2 font-bold text-amber-600 dark:text-amber-400"
                                            >{{ product.rating }}
                                            <span
                                                class="font-medium text-amber-600/70"
                                                >({{
                                                    product.reviewCount
                                                }})</span
                                            ></span
                                        >
                                    </div>
                                    <span
                                        class="text-gray-400 dark:text-zinc-500 font-mono text-xs"
                                        >SKU: {{ product.sku }}</span
                                    >
                                </div>
                            </div>

                            <!-- Price Card -->
                            <div
                                class="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-zinc-800"
                            >
                                <div class="flex items-end gap-4 mb-4">
                                    <span
                                        class="text-5xl font-black text-gray-900 dark:text-white"
                                        >{{ product.price.toFixed(2) }} €</span
                                    >
                                    <span
                                        v-if="product.oldPrice"
                                        class="text-xl text-gray-400 line-through mb-1.5"
                                        >{{
                                            product.oldPrice.toFixed(2)
                                        }}
                                        €</span
                                    >
                                </div>

                                <div class="flex items-center gap-2 mb-8">
                                    <div class="relative flex h-3 w-3">
                                        <span
                                            v-if="!isOutOfStock"
                                            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"
                                        ></span>
                                        <span
                                            class="relative inline-flex rounded-full h-3 w-3"
                                            :class="
                                                isOutOfStock
                                                    ? 'bg-red-500'
                                                    : 'bg-emerald-500'
                                            "
                                        ></span>
                                    </div>
                                    <span
                                        class="text-sm font-semibold uppercase tracking-wider"
                                        :class="
                                            isOutOfStock
                                                ? 'text-red-500'
                                                : 'text-emerald-600 dark:text-emerald-400'
                                        "
                                    >
                                        {{
                                            isOutOfStock
                                                ? "Rupture de stock"
                                                : "En stock prêt à expédier"
                                        }}
                                    </span>
                                </div>

                                <button
                                    :disabled="isOutOfStock"
                                    class="w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg transition-all duration-300"
                                    :class="
                                        isOutOfStock
                                            ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/30 hover:-translate-y-1'
                                    "
                                >
                                    <svg
                                        v-if="!isOutOfStock"
                                        class="w-6 h-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2.5"
                                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                        />
                                    </svg>
                                    {{
                                        isOutOfStock
                                            ? "Indisponible"
                                            : "Ajouter au panier"
                                    }}
                                </button>
                            </div>

                            <!-- Short Description -->
                            <div
                                class="prose prose-indigo dark:prose-invert text-gray-600 dark:text-zinc-400"
                            >
                                <p>
                                    {{
                                        product.shortDescription ||
                                        product.description.substring(0, 150) +
                                            "..."
                                    }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Full Description & Specs -->
                <div class="mt-24 grid lg:grid-cols-12 gap-12 lg:gap-16">
                    <div class="lg:col-span-7 space-y-8">
                        <h2
                            class="text-3xl font-bold text-gray-900 dark:text-white"
                        >
                            À propos de ce produit
                        </h2>
                        <div
                            class="text-gray-600 dark:text-zinc-400 leading-relaxed space-y-4 text-lg"
                        >
                            <p>{{ product.description }}</p>
                        </div>
                    </div>

                    <div
                        v-if="
                            product.specifications &&
                            Object.keys(product.specifications).length > 0
                        "
                        class="lg:col-span-5"
                    >
                        <div
                            class="bg-white dark:bg-zinc-900 rounded-[2rem] p-8 shadow-sm border border-gray-100 dark:border-zinc-800"
                        >
                            <h3
                                class="text-2xl font-bold text-gray-900 dark:text-white mb-6"
                            >
                                Caractéristiques
                            </h3>
                            <ul
                                class="divide-y divide-gray-100 dark:divide-zinc-800"
                            >
                                <li
                                    v-for="(
                                        value, key
                                    ) in product.specifications"
                                    :key="key"
                                    class="py-4 flex justify-between gap-4"
                                >
                                    <span
                                        class="text-gray-500 dark:text-zinc-400 capitalize font-medium"
                                        >{{ key }}</span
                                    >
                                    <span
                                        class="text-gray-900 dark:text-white text-right font-semibold"
                                        >{{ value }}</span
                                    >
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </main>

            <!-- BOTTOM SECTION: Product Recommendations -->
            <section
                class="mt-20 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 w-full py-24"
            >
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex items-end justify-between mb-12">
                        <div>
                            <h2
                                class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight"
                            >
                                Complétez votre style
                            </h2>
                            <p
                                class="mt-3 text-lg text-gray-500 dark:text-zinc-400"
                            >
                                Produits fréquemment achetés ensemble
                            </p>
                        </div>
                        <router-link
                            :to="`/category/${product.category}`"
                            class="hidden md:flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors group"
                        >
                            Voir la collection
                            <svg
                                class="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </router-link>
                    </div>

                    <div
                        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                    >
                        <router-link
                            v-for="item in relatedProducts"
                            :key="item._id"
                            :to="`/product/${item.slug}`"
                            class="group block relative"
                        >
                            <!-- Card Image -->
                            <div
                                class="relative bg-gray-50 dark:bg-zinc-950 rounded-[2rem] overflow-hidden aspect-[4/5] mb-6 border border-gray-100 dark:border-zinc-800 transition-all duration-300 group-hover:shadow-2xl group-hover:-translate-y-2"
                            >
                                <img
                                    :src="item.images?.[0] || PLACEHOLDER_IMG"
                                    :alt="item.name"
                                    class="w-full h-full object-contain p-6 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
                                />

                                <!-- Quick add button (UI only) -->
                                <div
                                    class="absolute bottom-4 right-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                                >
                                    <button
                                        class="bg-indigo-600 text-white p-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-colors"
                                        @click.prevent
                                    >
                                        <svg
                                            class="w-5 h-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Card Info -->
                            <div>
                                <p
                                    class="text-sm text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider mb-2"
                                >
                                    {{ item.brand }}
                                </p>
                                <h3
                                    class="text-lg font-bold text-gray-900 dark:text-white mb-2 truncate group-hover:text-indigo-600 transition-colors"
                                >
                                    {{ item.name }}
                                </h3>
                                <div class="flex items-center gap-3">
                                    <p
                                        class="text-xl font-extrabold text-gray-900 dark:text-white"
                                    >
                                        {{ item.price.toFixed(2) }} €
                                    </p>
                                    <p
                                        v-if="item.oldPrice"
                                        class="text-sm text-gray-400 line-through"
                                    >
                                        {{ item.oldPrice.toFixed(2) }} €
                                    </p>
                                </div>
                            </div>
                        </router-link>
                    </div>

                    <!-- Mobile view all button -->
                    <div class="mt-10 md:hidden flex justify-center">
                        <router-link
                            :to="`/category/${product.category}`"
                            class="px-8 py-4 bg-gray-100 dark:bg-zinc-800 rounded-xl font-bold text-gray-900 dark:text-white hover:bg-gray-200 transition-colors w-full text-center"
                        >
                            Voir toute la collection
                        </router-link>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>
