<script setup lang="ts">
import Header from "./components/layouts/Header.vue";
import Footer from "./components/layouts/Footer.vue";
</script>

<template>
    <div class="flex min-h-dvh flex-col">
        <a
            href="#main"
            class="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-indigo-500 focus:px-4 focus:py-2 focus:text-white"
            >Aller au contenu</a
        >
        <Header />

        <main id="main" class="flex-1">
            <RouterView />
        </main>

        <Footer />
    </div>
</template>
