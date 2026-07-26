<script setup lang="ts">
import Header from "./components/layouts/Header.vue";
</script>

<template>
    <div class="min-h-screen bg-zinc-950">
        <Header />

        <main>
            <RouterView />
        </main>

        <footer></footer>
    </div>
</template>

<style scoped></style>
