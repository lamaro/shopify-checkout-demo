import { useEffect } from "react";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useShopContext } from "@/contexts/shopContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { getProducts, createShopifyCheckout, createShopifyProduct } =
    useShopContext();

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  const goToCheckout = () => {
    createShopifyCheckout([
      { gid: "gid://shopify/ProductVariant/47007327846690", quantity: 2 },
      { gid: "gid://shopify/ProductVariant/47007327879458", quantity: 5 },
    ]);
  };

  const createSampleProduct = () => {
    createShopifyProduct([
      {
        title: "Pepe Coin",
        options: "Pepe Coin x 1",
        price: 2000,
        sku: "DADA",
      },
      {
        title: "Pepe Coin 2",
        options: "Pepe Coin x 2",
        price: 4000,
        sku: "DADA2",
      },
      {
        title: "Pepe Coin 3",
        options: "Pepe Coin x 3",
        price: 5100.98,
        sku: "DADA3",
      },
    ]);
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <button onClick={goToCheckout}>Create Checkout</button>
      <button onClick={createSampleProduct}>Create Product</button>
    </main>
  );
}
