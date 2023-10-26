import axios from "axios";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const storefrontAccessToken =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESSTOKEN;

async function ShopifyData(query) {
  const URL = `https://${domain}/api/2023-10/graphql.json`;
  try {
    const runQuery = await axios.post(
      URL,
      { query },
      {
        headers: {
          "X-Shopify-Storefront-Access-Token": storefrontAccessToken,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    return runQuery.data;
  } catch (error) {
    throw new Error("Products not fetched", error);
  }
}

export async function getAllProducts() {
  const query = `{
    products(first: 250) {
      edges {
        node {
          handle
          id
        }
      }
    }
  }`;

  const response = await ShopifyData(query);

  const slugs = response.data.products.edges
    ? response.data.products.edges
    : [];

  return slugs;
}
// export async function getChannels() {
//   const query = `{
//     publications(first:10) {
//       edges {
//         node {
//           id
//           name
//         }
//       }
//     } 
//   }`;

//   const response = await ShopifyData(query);
// console.log(response)
//   const channels = response.data ? response.data : [];

//   return channels;
// }

export async function getProduct(handle) {
  const query = `
  {
    product(handle: "${handle}") {
    	collections(first: 1) {
      	edges {
          node {
            products(first: 5) {
              edges {
                node {
                  priceRange {
                    minVariantPrice {
                      amount
                    }
                  }
                  handle
                  title
                  id
                  images(first: 5) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
    	}
      id
      title
      handle
      description
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      options {
        name
        values
        id
      }
      variants(first: 25) {
        edges {
          node {
            selectedOptions {
              name
              value
            }
            image {
              url
              altText
            }
            title
            id
            availableForSale
            priceV2 {
              amount
            }
          }
        }
      }
    }
  }`;

  const response = await ShopifyData(query);

  const product = response.data.product ? response.data.product : [];

  return product;
}

export async function createCheckout(lineItems) {
  const lineItemsObject = lineItems.map((item) => {
    return `{variantId: "${item.gid}",quantity: ${item.quantity}}`;
  });
  console.log(lineItemsObject);
  const query = `
    mutation {
      checkoutCreate(input: {
        lineItems: [${lineItemsObject}]
      }) {
        checkout {
          id
          webUrl
        }
      }
    }`;

  try {
    const response = await ShopifyData(query);
    console.log(response);
    const checkout = response.data.checkoutCreate.checkout
      ? response.data.checkoutCreate.checkout
      : [];

    return checkout;
  } catch (error) {
    console.log("Error create checkout", error);
  }
}

export async function updateCheckout(id, lineItems) {
  const lineItemsObject = lineItems.map((item) => {
    return `{
      variantId: "${item.id}",
      quantity:  ${item.variantQuantity}
    }`;
  });

  const query = `
  mutation {
    checkoutLineItemsReplace(lineItems: [${lineItemsObject}], checkoutId: "${id}") {
      checkout {
        id
        webUrl
        lineItems(first: 25) {
          edges {
            node {
              id
              title
              quantity
            }
          }
        }
      }
    }
  }`;

  const response = await ShopifyData(query);
  const checkout = response.data.checkoutLineItemsReplace.checkout
    ? response.data.checkoutLineItemsReplace.checkout
    : [];

  return checkout;
}
