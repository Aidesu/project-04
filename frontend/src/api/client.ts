import axios from "axios";
import type { ApiStatus, Category, Product } from "@/types";

/**
 * Toutes les requêtes passent par /api :
 * - en dev, Vite les transmet au backend (voir vite.config.ts)
 * - en prod, c'est nginx qui s'en charge
 */
const http = axios.create({
    baseURL: "/api",
    timeout: 10000,
});

export interface ProductQuery {
    category?: string;
    search?: string;
    limit?: number;
}

export const api = {
    async getStatus(): Promise<ApiStatus> {
        // Une 503 (base déconnectée) renvoie quand même un corps exploitable
        const { data } = await http.get<ApiStatus>("/status", {
            timeout: 5000,
            validateStatus: (s) => s === 200 || s === 503,
        });
        return data;
    },

    async getCategories(): Promise<Category[]> {
        const { data } = await http.get<Category[]>("/categories");
        return data;
    },

    async getProducts(query: ProductQuery = {}): Promise<Product[]> {
        const { data } = await http.get<Product[]>("/products", {
            params: {
                category: query.category || undefined,
                search: query.search?.trim() || undefined,
                limit: query.limit,
            },
        });
        return data;
    },

    async getProduct(slug: string): Promise<Product> {
        const { data } = await http.get<Product>(
            `/products/${encodeURIComponent(slug)}`,
        );
        return data;
    },
};

export function isNotFound(error: unknown): boolean {
    return axios.isAxiosError(error) && error.response?.status === 404;
}

/** Message d'erreur lisible pour l'utilisateur */
export function errorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (!error.response) {
            return "Impossible de joindre le serveur. Vérifiez votre connexion.";
        }
        if (error.response.status >= 500) {
            return "Le serveur a rencontré un problème. Réessayez dans un instant.";
        }
    }
    return "Une erreur inattendue est survenue.";
}
