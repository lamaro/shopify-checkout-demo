/*
https://community.shopify.com/c/graphql-basics-and/graphql-api-publish-to-all-channels/m-p/897309
https://shopify.dev/docs/api/admin-graphql/2023-10/mutations/publishablePublish
https://community.shopify.com/c/sales-channels-payments-apps-and/edit-product-sales-channels-via-rest-api/td-p/1771221


*/





import { createContext, useState, useContext, ReactNode } from "react";
import { createCheckout } from "@/lib/shopify";
import { createProduct, parseProduct } from "@/lib/backend";

type CartItem = {
  gid: string;
  quantity: number;
};

type ParsedProduct = {
  title: string;
  admin_graphql_api_id: string;
  variants: ParsedVariant[];
};

type ParsedVariant = {
  title: string;
  sku: string;
  price: number;
  admin_graphql_api_id: string;
};

type ProductVariation = {
  sku: string;
  options: string;
  title: string;
  price: number;
};

interface ShopContextProps {
  cart: CartItem[];
  checkoutId: string;
  checkoutUrl: string;
  getProducts: () => void;
  createShopifyCheckout: (items: CartItem[]) => void;
  createShopifyProduct: (variations: ProductVariation[]) => void;
}

interface ShopContextProviderProps {
  children: ReactNode;
}

const ShopContext = createContext<ShopContextProps | undefined>(undefined);

export const ShopContextProvider: React.FC<ShopContextProviderProps> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [newProduct, setNewProduct] = useState<ParsedProduct[]>([]);
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [checkoutId, setCheckoutId] = useState<string>("");
  const [checkoutUrl, setCheckoutUrl] = useState<string>("");
  const [cartLoading, setCartLoading] = useState<boolean>(false);

  const getProducts = async () => {
    // const prod = await getAllProducts();
    // console.log(prod);
  };

  const createShopifyProduct = async (variations: ProductVariation[]) => {
    const newProduct = await createProduct(variations);
    console.log(newProduct)
    const parsedProduct = parseProduct(newProduct.product);
    // setNewProduct(parsedProduct);
    console.log(parsedProduct);

    const checkoutItems = parsedProduct.variants.map(({ gid }) => {
      return { gid, quantity: 1 };
    });

    console.log(checkoutItems);
    await createShopifyCheckout(checkoutItems);
  };

  const createShopifyCheckout = async (items: CartItem[]) => {
    //Add updateCheckout funct.
    try {
      const checkout = await createCheckout(items);
      console.log("Checkout URL", checkout.webUrl);
      setCheckoutId(checkout.id);
      setCheckoutUrl(checkout.webUrl);
      localStorage.setItem("checkout_id", JSON.stringify([items, checkout]));
      //TODO Redirect to checkout URL?
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
        createShopifyProduct,
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
