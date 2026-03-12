import { apiFetch } from './api';

export async function getProducts() {
    return await apiFetch("/get_products");
}

export async function createCheckout(priceId, quantity) {
    console.log("createCheckout args:", { priceId, quantity });

    return await apiFetch("/create_checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            price_id: priceId,
            quantity: quantity,
        }),
    });
}
