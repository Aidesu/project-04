<script setup lang="ts">
import StateMessage from "@/components/StateMessage.vue";
</script>

<template>
    <div class="container-page py-24">
        <StateMessage
            icon="warning"
            title="Page introuvable"
            message="Le lien est peut-être erroné, ou la page a été déplacée."
        >
            <RouterLink to="/" class="btn btn-primary">Retour à l'accueil</RouterLink>
            <RouterLink to="/products" class="btn btn-ghost"
                >Parcourir le catalogue</RouterLink
            >
        </StateMessage>
    </div>
</template>
