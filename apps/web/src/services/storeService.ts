import { apiFetch } from './api';
import type { StoreProduct } from '../types';

export async function getProducts() {
    return await apiFetch<{ products: StoreProduct[] }>("/api/get_products");
}

export async function createCheckout(priceId: string, quantity: number) {
    console.log("createCheckout args:", { priceId, quantity });

    return await apiFetch<{ url: string }>("/api/create_checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            price_id: priceId,
            quantity: quantity,
        }),
    });
}
