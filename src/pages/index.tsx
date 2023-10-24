import { useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useShopContext } from "@/contexts/shopContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { getProducts, createShopifyCheckout } = useShopContext();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const goToCheckout = () => {
    createShopifyCheckout([
      { id: "gid://shopify/ProductVariant/46921440756002", quantity: 2 },
      { id: "gid://shopify/ProductVariant/46921440756002", quantity: 5 },
    ]);
  };
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <button onClick={goToCheckout}>Create Checkout</button>
    </main>
  );
}
