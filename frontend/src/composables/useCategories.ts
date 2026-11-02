import { computed, ref } from "vue";
import { api, errorMessage } from "@/api/client";
import type { Category } from "@/types";

// État partagé : les catégories sont chargées une seule fois pour toute l'app
// (header, accueil, catalogue, fil d'Ariane…)
const categories = ref<Category[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
let pending: Promise<void> | null = null;

async function load(force = false): Promise<void> {
    if (pending) return pending;
    if (!force && categories.value.length > 0) return;

    loading.value = true;
    error.value = null;

    pending = api
        .getCategories()
        .then((data) => {
            categories.value = data;
        })
        .catch((e: unknown) => {
            error.value = errorMessage(e);
        })
        .finally(() => {
            loading.value = false;
            pending = null;
        });

    return pending;
}

export function useCategories() {
    void load();

    const bySlug = computed(
        () => new Map(categories.value.map((c) => [c.slug, c])),
    );

    /** Nom affichable d'une catégorie à partir de son slug */
    const nameOf = (slug: string | undefined): string => {
        if (!slug) return "";
        return bySlug.value.get(slug)?.name ?? slug;
    };

    return {
        categories,
        loading,
        error,
        reload: () => load(true),
        nameOf,
    };
}
