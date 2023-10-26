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
      { gid: "gid://shopify/ProductVariant/47005271752994", quantity: 2 },
      { gid: "gid://shopify/ProductVariant/47005271785762", quantity: 5 },
    ]);
  };

  const createSampleProduct = () => {
    const prodCreated = createShopifyProduct([
      { sku: "2223", option1:"test1", title: "Apple Watch1", price: 200.99, inventory: 3 },
      { sku: "ooo", option1:"test2", title: "Apple Watch2", price: 200.99, inventory: 3 },
      { sku: "j00kk", option1:"tes3", title: "Apple Watch3", price: 200.99, inventory: 3 },
    ]);
    console.log(prodCreated);
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
