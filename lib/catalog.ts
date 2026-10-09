import nutsImage from "@/assets/nuts-collection.jpg";
import fruitsImage from "@/assets/fruits-makhana.jpg";
import seedsImage from "@/assets/seeds-collection.jpg";

export type ProductCategory = "nuts" | "dried-fruits" | "superfoods";

export type Product = {
  id: string;
  name: string;
  bengali: string;
  pricePerKg: number;
  category: ProductCategory;
  image: string;
  imagePosition: string;
  note: string;
};

export type CartItem = {
  productId: string;
  grams: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "cashew",
    name: "Cashew",
    bengali: "কাজুবাদাম",
    pricePerKg: 1400,
    category: "nuts",
    image: nutsImage,
    imagePosition: "20% 58%",
    note: "Creamy, crisp & versatile.",
  },
  {
    id: "raisins",
    name: "Raisins",
    bengali: "কিশমিশ",
    pricePerKg: 550,
    category: "dried-fruits",
    image: fruitsImage,
    imagePosition: "54% 15%",
    note: "Naturally sweet golden bites.",
  },
  {
    id: "walnut",
    name: "Walnut",
    bengali: "আখরোট",
    pricePerKg: 1300,
    category: "nuts",
    image: nutsImage,
    imagePosition: "74% 66%",
    note: "Rich, earthy & satisfying.",
  },
  {
    id: "almond",
    name: "Almond",
    bengali: "কাঠবাদাম",
    pricePerKg: 1100,
    category: "nuts",
    image: nutsImage,
    imagePosition: "58% 18%",
    note: "Everyday family nourishment.",
  },
  {
    id: "sunflower-seeds",
    name: "Sunflower Seeds",
    bengali: "সূর্যমুখীর বীজ",
    pricePerKg: 600,
    category: "superfoods",
    image: seedsImage,
    imagePosition: "70% 26%",
    note: "Mild crunch for daily meals.",
  },
  {
    id: "chia-seeds",
    name: "Chia Seeds",
    bengali: "চিয়া বীজ",
    pricePerKg: 500,
    category: "superfoods",
    image: seedsImage,
    imagePosition: "30% 68%",
    note: "Tiny seeds, easy everyday use.",
  },
  {
    id: "fig",
    name: "Fig",
    bengali: "আঞ্জির",
    pricePerKg: 1400,
    category: "dried-fruits",
    image: fruitsImage,
    imagePosition: "24% 66%",
    note: "Soft, naturally sweet & hearty.",
  },
  {
    id: "fox-nut",
    name: "Fox Nut / Makhana",
    bengali: "মাখনা",
    pricePerKg: 1350,
    category: "superfoods",
    image: fruitsImage,
    imagePosition: "78% 68%",
    note: "Light, wholesome snacking.",
  },
];

export const PRESET_GRAMS = [100, 200, 250, 500, 1000] as const;

export const PACKS = {
  everyday: [
    { productId: "cashew", grams: 100 },
    { productId: "almond", grams: 100 },
    { productId: "raisins", grams: 100 },
  ],
  family: [
    { productId: "cashew", grams: 200 },
    { productId: "almond", grams: 200 },
    { productId: "walnut", grams: 200 },
    { productId: "raisins", grams: 200 },
  ],
} satisfies Record<string, CartItem[]>;

export function productById(id: string) {
  return PRODUCTS.find((product) => product.id === id);
}

export function lineTotal(pricePerKg: number, grams: number) {
  return (pricePerKg * grams) / 1000;
}

export function formatRupees(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export function formatWeight(grams: number) {
  return grams === 1000 ? "1 KG" : grams > 1000 ? `${grams / 1000} KG` : `${grams} Grams`;
}

export function packTotal(items: CartItem[]) {
  return items.reduce((total, item) => {
    const product = productById(item.productId);
    return total + (product ? lineTotal(product.pricePerKg, item.grams) : 0);
  }, 0);
}

export function buildOrderSummary(items: CartItem[], note: string, bulkQuote: boolean) {
  const lines = items.flatMap((item, index) => {
    const product = productById(item.productId);
    if (!product) return [];
    return [
      `${index + 1}. ${product.name} (${product.bengali})`,
      `   Quantity: ${formatWeight(item.grams)}`,
      `   Rate: ${formatRupees(product.pricePerKg)}/KG`,
      `   Line total: ${formatRupees(lineTotal(product.pricePerKg, item.grams))}`,
    ];
  });

  const subtotal = items.reduce((total, item) => {
    const product = productById(item.productId);
    return total + (product ? lineTotal(product.pricePerKg, item.grams) : 0);
  }, 0);

  return [
    "Hello, Kamdhenu Enterprise!",
    "",
    bulkQuote
      ? "I would like a quotation for this basket:"
      : "I would like to enquire about this order:",
    "",
    ...lines,
    "",
    `Estimated subtotal: ${formatRupees(subtotal)}`,
    `Estimated grand total: ${formatRupees(subtotal)}`,
    ...(bulkQuote ? ["Request Type: Celebration / Bulk Quotation."] : []),
    ...(note.trim() ? [`Customer note: ${note.trim()}`] : []),
    "",
    "Please confirm current availability, final pricing, payment, and delivery or pickup arrangements.",
  ].join("\n");
}
