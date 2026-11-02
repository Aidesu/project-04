<script setup lang="ts">
import { computed } from "vue";
import type { Product } from "@/types";
import { discountPercent, formatPrice } from "@/utils/format";
import ProductImage from "./ProductImage.vue";

const props = defineProps<{ product: Product }>();

const discount = computed(() =>
    discountPercent(props.product.price, props.product.oldPrice),
);
const inStock = computed(() => props.product.stock > 0);
const lowStock = computed(
    () => props.product.stock > 0 && props.product.stock <= 5,
);
</script>

<template>
    <RouterLink
        :to="{ name: 'product-detail', params: { slug: product.slug } }"
        class="group flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60 transition duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900 hover:shadow-2xl hover:shadow-black/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
    >
        <div class="relative aspect-square overflow-hidden bg-zinc-900 p-6">
            <div
                class="h-full w-full transition-transform duration-500 group-hover:scale-105"
            >
                <ProductImage :src="product.images?.[0]" :alt="product.name" />
            </div>

            <div class="absolute left-3 top-3 flex flex-col items-start gap-1.5">
                <span
                    v-if="discount > 0"
                    class="rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white"
                    >-{{ discount }}%</span
                >
                <span
                    v-if="product.newArrival"
                    class="rounded-full bg-indigo-500 px-2.5 py-1 text-xs font-semibold text-white"
                    >Nouveau</span
                >
                <span
                    v-if="product.bestSeller"
                    class="rounded-full bg-amber-500 px-2.5 py-1 text-xs font-semibold text-zinc-950"
                    >Best-seller</span
                >
            </div>
        </div>

        <div class="flex flex-1 flex-col gap-2 border-t border-zinc-800/80 p-5">
            <p
                class="text-xs font-semibold uppercase tracking-wider text-indigo-400"
            >
                {{ product.brand }}
            </p>
            <h3
                class="line-clamp-2 font-semibold leading-snug text-zinc-100 transition-colors group-hover:text-white"
            >
                {{ product.name }}
            </h3>

            <div
                v-if="product.reviewCount > 0"
                class="flex items-center gap-1 text-xs text-zinc-400"
            >
                <span class="text-amber-400" aria-hidden="true">★</span>
                <span class="font-medium text-zinc-300">{{
                    product.rating.toFixed(1)
                }}</span>
                <span>({{ product.reviewCount }} avis)</span>
            </div>

            <div class="mt-auto flex items-end justify-between gap-3 pt-3">
                <div class="flex flex-col">
                    <span
                        v-if="discount > 0"
                        class="text-xs text-zinc-500 line-through"
                        >{{ formatPrice(product.oldPrice) }}</span
                    >
                    <span class="text-xl font-bold text-white">{{
                        formatPrice(product.price)
                    }}</span>
                </div>

                <span
                    class="inline-flex items-center gap-1.5 text-xs font-medium"
                    :class="
                        !inStock
                            ? 'text-rose-400'
                            : lowStock
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                    "
                >
                    <span
                        class="h-1.5 w-1.5 rounded-full"
                        :class="
                            !inStock
                                ? 'bg-rose-400'
                                : lowStock
                                  ? 'bg-amber-400'
                                  : 'bg-emerald-400'
                        "
                    />
                    {{
                        !inStock
                            ? "Rupture"
                            : lowStock
                              ? `Plus que ${product.stock}`
                              : "En stock"
                    }}
                </span>
            </div>
        </div>
    </RouterLink>
</template>
