<script setup lang="ts">
import AppIcon from "./AppIcon.vue";
import type { IconName } from "./icons";

withDefaults(
    defineProps<{
        title: string;
        message?: string;
        icon?: IconName;
        tone?: "neutral" | "error";
    }>(),
    { icon: "search", tone: "neutral" },
);
</script>

<template>
    <div
        class="flex flex-col items-center rounded-2xl border border-dashed px-6 py-16 text-center"
        :class="
            tone === 'error'
                ? 'border-rose-500/30 bg-rose-500/5'
                : 'border-zinc-800 bg-zinc-900/30'
        "
        :role="tone === 'error' ? 'alert' : 'status'"
    >
        <div
            class="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
            :class="
                tone === 'error'
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-zinc-800 text-zinc-400'
            "
        >
            <AppIcon :name="icon" class="h-7 w-7" />
        </div>
        <h3 class="text-lg font-semibold text-white">{{ title }}</h3>
        <p v-if="message" class="mt-2 max-w-md text-sm text-zinc-400">
            {{ message }}
        </p>
        <div v-if="$slots.default" class="mt-6 flex flex-wrap justify-center gap-3">
            <slot />
        </div>
    </div>
</template>
