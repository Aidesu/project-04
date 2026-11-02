<script setup lang="ts">
import { ref, watch } from "vue";
import AppIcon from "./AppIcon.vue";

const props = defineProps<{
    src?: string;
    alt: string;
}>();

// Si l'image est absente ou ne charge pas, on affiche un visuel neutre
const failed = ref(false);
watch(
    () => props.src,
    () => (failed.value = false),
);
</script>

<template>
    <img
        v-if="src && !failed"
        :src="src"
        :alt="alt"
        loading="lazy"
        class="h-full w-full object-contain"
        @error="failed = true"
    />
    <div
        v-else
        class="flex h-full w-full items-center justify-center text-zinc-700"
        role="img"
        :aria-label="alt"
    >
        <AppIcon name="cpu" class="h-1/4 max-h-16 w-1/4 max-w-16" />
    </div>
</template>
