export type Size = 'kids' | 'small' | 'medium' | 'large' | 'xl';
export type ContainerType = 'sugar-cone' | 'waffle-cone' | 'cake-cone' | 'cup' | 'dish';

export const TOPPINGS = [
  'Rainbow Sprinkles',
  'Chocolate Sprinkles',
  'Hot Fudge',
  'Caramel',
  'Whipped Cream',
  'Cherry',
  'Crushed Oreos',
  'Chopped Nuts',
  'Gummy Bears',
  'Marshmallows',
  'Strawberry Sauce',
  'Butterscotch',
] as const;

export type Topping = (typeof TOPPINGS)[number];

export interface Stand {
  name: string;
  placeId: string;
  address: string;
}

export interface Scoop {
  id: string;
  stand: Stand;
  flavor: string;
  size: Size;
  container: ContainerType;
  price?: number;
  toppings: Topping[];
  flavorRating: number;
  valueRating: number;
  notes?: string;
  createdAt: Date;
  user: { name: string };
}

export const SIZE_LABELS: Record<Size, string> = {
  kids: 'Kids',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
  xl: 'XL',
};

export const CONTAINER_LABELS: Record<ContainerType, { label: string; emoji: string }> = {
  'sugar-cone': { label: 'Sugar Cone', emoji: '🍦' },
  'waffle-cone': { label: 'Waffle Cone', emoji: '🧇' },
  'cake-cone': { label: 'Cake Cone', emoji: '🍧' },
  cup: { label: 'Cup', emoji: '🥤' },
  dish: { label: 'Dish', emoji: '🍽️' },
};
