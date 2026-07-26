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
        error.value = "Backend error";
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchData();
});
</script>

<template>
    <div class="container">
        <h1>project-04</h1>

        <p v-if="loading">Loading in progress...</p>

        <p v-else-if="error" style="color: red">
            {{ error }}
        </p>

        <div v-else-if="apiData" class="result">
            <p><strong>Backend message :</strong> {{ apiData.status }}</p>
            <p><strong>DB status :</strong> {{ apiData.db_state }}</p>
        </div>
    </div>
</template>
