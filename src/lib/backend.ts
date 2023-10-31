import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ProductVariation = {
  sku: string;
  options: string;
  title: string;
  price: number;
};

type ParsedVariant = {
  title: string;
  sku: string;
  price: number;
  id: string;
};

type ParsedProduct = {
  title: string;
  id: string;
  variants: ParsedVariant[];
};

const parseProduct = ({ id, title, variants }: ParsedProduct) => {
  const parsedVariants = variants.map(
    ({ title, sku, price, id }: ParsedVariant) => {
      return { title, sku, price, gid: id };
    }
  );
  console.log(parsedVariants);
  return { id, title, variants: parsedVariants };
};

const createProduct = async (variations: ProductVariation[]) => {
  const variants = variations.map(({ sku, options, title, price }) => {
    return { title, sku, price, options };
  });

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
