export type PublicMenuItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
  priceBgn: number;
  portionGrams: number;
  category: "BURGER" | "FRIES" | "DRINK";
  imagePath: string;
};

export type CartLine = {
  id: string;
  name: string;
  priceBgn: number;
  imagePath: string;
  quantity: number;
};
