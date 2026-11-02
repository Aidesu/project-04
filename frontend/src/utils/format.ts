const priceFormatter = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
});

export function formatPrice(value: number | null | undefined): string {
    return typeof value === "number" ? priceFormatter.format(value) : "—";
}

export function discountPercent(price: number, oldPrice: number | null): number {
    if (!oldPrice || oldPrice <= price) return 0;
    return Math.round(((oldPrice - price) / oldPrice) * 100);
}

/** "boostClock" -> "Boost clock", "base_clock" -> "Base clock" */
export function humanizeKey(key: string): string {
    const spaced = key
        .replace(/[_-]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .toLowerCase()
        .trim();
    return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function formatSpecValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Oui" : "Non";
    if (Array.isArray(value)) return value.map(formatSpecValue).join(", ");
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}
