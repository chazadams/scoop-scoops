export type Size = 'kids' | 'small' | 'medium' | 'large';
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
  lat?: number;
  lng?: number;
}


export const SIZE_LABELS: Record<Size, string> = {
  kids: 'Kiddie',
  small: 'Small',
  medium: 'Medium',
  large: 'Large',
};

export const CONTAINER_LABELS: Record<ContainerType, { label: string; emoji: string }> = {
  'sugar-cone': { label: 'Sugar Cone', emoji: '🍦' },
  'waffle-cone': { label: 'Waffle Cone', emoji: '🧇' },
  'cake-cone': { label: 'Cake Cone', emoji: '🍧' },
  cup: { label: 'Bowl/Cup', emoji: '🥣' },
  dish: { label: 'Speciality', emoji: '🍨' },
};
