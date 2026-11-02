export interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
    itemCount: number;
}

export interface Product {
    _id: string;
    name: string;
    slug: string;
    /** Slug de la catégorie */
    category: string;
    brand: string;
    sku?: string;
    description: string;
    shortDescription: string;
    price: number;
    oldPrice: number | null;
    stock: number;
    images: string[];
    specifications: Record<string, unknown>;
    rating: number;
    reviewCount: number;
    featured: boolean;
    bestSeller: boolean;
    newArrival: boolean;
    active: boolean;
}

export interface ApiStatus {
    status: string;
    db_state: string;
}
