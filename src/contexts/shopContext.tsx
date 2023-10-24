import { createContext, useState, useContext, ReactNode } from "react";
import { createCheckout, updateCheckout, getAllProducts } from "@/lib/shopify";

type CartItem = {
  id: string;
  quantity: number;
};

interface ShopContextProps {
  cart: CartItem[];
  checkoutId: string;
  checkoutUrl: string;
  getProducts: () => void;
  createShopifyCheckout: (items: CartItem[]) => void;
}

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const ShopContextProvider: React.FC<ShopContextProviderProps> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  // const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutId, setCheckoutId] = useState<string>("");
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  // const [cartLoading, setCartLoading] = useState<boolean>(false);

  //example request data
  const getProducts = async () => {
    const prod = await getAllProducts();
    console.log(prod);
  };

  const createProduct = async () => {
    //TODO
    //first create product in our API and get variants, then
    //createShopifyCheckout(variantsAndQuantities)
  };

  const createShopifyCheckout = async (items: CartItem[]) => {
    //Add updateCheckout funct.
    try {
      const checkout = await createCheckout(items);
      console.log(checkout.webUrl);
      setCheckoutId(checkout.id);
      setCheckoutUrl(checkout.webUrl);
      localStorage.setItem("checkout_id", JSON.stringify([items, checkout]));
      //Redirect to checkout URL?
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        checkoutId,
        checkoutUrl,
        getProducts,
        createShopifyCheckout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopContext = (): ShopContextProps => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopContextProvider");
  }
  return context;
};

export default ShopContext;
