import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProductVariation = {
  sku: string;
  option1: string;
  title: string;
  price: number;
  inventory: number;
};

type ParsedVariant = {
  title: string;
  sku: string;
  price: number;
  admin_graphql_api_id: string;
};

type ParsedProduct = {
  title: string;
  admin_graphql_api_id: string;
  variants: ParsedVariant[];
};


const parseProduct = ({ admin_graphql_api_id, title, variants }: ParsedProduct) => {
  const parsedVariants = variants.map(
    ({ title, sku, price, admin_graphql_api_id }: ParsedVariant) => {
      return { title, sku, price, gid: admin_graphql_api_id };
    }
  );
  console.log(parsedVariants)
  return { admin_graphql_api_id, title, variants: parsedVariants };
};

const createProduct = async (variations: ProductVariation[]) => {
  const variants = variations.map(
    ({ sku, option1, title, price, inventory }) => {
      return {
        inventory_quantity: inventory,
        option1,
        price,
        sku,
        title,
      };
    }
  );

  try {
    const newProduct = await axios.post(
      `${API_URL!}/products`,
      { variants },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return newProduct.data;
  } catch (error) {
    console.log(error);
  }
};

export { createProduct, parseProduct };
