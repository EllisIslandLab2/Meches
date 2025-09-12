export interface ProductVariant {
  image: string;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  variants: Record<string, ProductVariant>;
  defaultVariant: string;
  selectorType: string;
  selectorLabel: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Handmade Earrings - Cowgirl Style",
    price: 8.99,
    category: "earrings",
    description: "Beautiful handcrafted cowgirl and star earrings",
    variants: {
      "cowgirl": {
        image: "/assets/images/earrings-cowgirl-rbw.JPG",
        name: "Cowgirl"
      },
      "star": {
        image: "/assets/images/earrings-star-usa.JPG",
        name: "Star"
      }
    },
    defaultVariant: "cowgirl",
    selectorType: "type",
    selectorLabel: "Type"
  },
  {
    id: 2,
    name: "Handmade Earrings - Drip Style",
    price: 13.99,
    category: "earrings",
    description: "Beautiful drip-style earrings in multiple colors",
    variants: {
      "brown": {
        image: "/assets/images/earrings-drip-usabrn.JPG",
        name: "Brown"
      },
      "teal": {
        image: "/assets/images/earrings-drip-usateal.JPG",
        name: "Teal"
      }
    },
    defaultVariant: "brown",
    selectorType: "color",
    selectorLabel: "Color"
  },
  {
    id: 3,
    name: "Handmade Earrings - Floral Style",
    price: 13.99,
    category: "earrings",
    description: "Elegant floral earrings in vibrant colors",
    variants: {
      "red": {
        image: "/assets/images/earrings-floral-red.JPG",
        name: "Red"
      },
      "blue": {
        image: "/assets/images/earrings-floral-blue.JPG",
        name: "Blue"
      }
    },
    defaultVariant: "red",
    selectorType: "color",
    selectorLabel: "Color"
  },
  {
    id: 4,
    name: "Handmade Earrings - Decorative Style",
    price: 15.99,
    category: "earrings",
    description: "Beautiful decorative earrings with bow and flower designs",
    variants: {
      "bow": {
        image: "/assets/images/earrings-floral-bow-wp.JPG",
        name: "Bow"
      },
      "flower": {
        image: "/assets/images/earrings-floral-flower-blue.JPG",
        name: "Flower"
      }
    },
    defaultVariant: "bow",
    selectorType: "type",
    selectorLabel: "Type"
  }
];