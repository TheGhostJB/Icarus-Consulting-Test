import { useEffect, useState } from "react";
import { getProducts, createCheckout } from "../services/storeService";
import { useNavigate } from "react-router-dom";
import type { StoreProduct } from "../types";
import Navbar from "../components/layout/Navbar";

async function HandleOnClick(default_price: string, quantity: string | number){
  try {
    const data = await createCheckout(default_price, Number(quantity));
    window.location.href = data.url;
  } catch (err) {
    console.error("Checkout error:", err);
  }
}

export default function StorePage() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(res.products))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F5F7]">
        <main className="mx-auto w-full max-w-[1400px] p-6">
          <Navbar />
          <p className="text-gray-600">Loading products…</p>
        </main>
      </div>
    );
  }

  console.log("Products loaded:", products);

  return (
    <div className="min-h-screen bg-[#F4F5F7]">
      <main className="mx-auto w-full max-w-[1400px] p-6">
        <Navbar />
        <h1 className="mb-6 text-2xl font-bold text-[#0f3d78]">Store</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {products &&
            products.map((item) => (
              <div
                key={item.id}
                style={{ border: "1px solid #ccc", padding: "1rem", borderRadius: "8px" }}
              >
                {item.images?.[0] && (
                  <img src={item.images[0]} alt={item.name} style={{ width: "100%" }} />
                )}
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>${item.default_price}</p>
                <label htmlFor="cantidad">Quantity: </label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  min={1}
                  step={1}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                />
                <button type="button" onClick={() => HandleOnClick(item.default_price, quantity)}>
                  Buy
                </button>
              </div>
            ))}
        </div>
      </main>
    </div>
  );
}
