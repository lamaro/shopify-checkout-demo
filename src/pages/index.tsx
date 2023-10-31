import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import { useShopContext } from "@/contexts/shopContext";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
  const { createShopifyProduct } = useShopContext();

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
      <button onClick={createSampleProduct}>Create Checkout</button>
    </main>
  );
}
