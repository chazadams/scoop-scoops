export type Size = 'kids' | 'small' | 'medium' | 'large' | 'one-size';
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

export type Topping = string;

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
  'one-size': 'One Size',
};

export const CONTAINER_LABELS: Record<ContainerType, { label: string; emoji: string }> = {
  'cake-cone': { label: 'Cake Cone', emoji: '🍧' },
  'sugar-cone': { label: 'Sugar Cone', emoji: '🍦' },
  'waffle-cone': { label: 'Waffle Cone', emoji: '🧇' },
  cup: { label: 'Bowl/Cup', emoji: '🥣' },
  dish: { label: 'Speciality', emoji: '🍨' },
};
