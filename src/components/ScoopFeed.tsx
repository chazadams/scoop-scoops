import ScoopCard from './ScoopCard';
import { type Scoop } from '@/types/scoop';

const MOCK_SCOOPS: Scoop[] = [
  {
    id: '1',
    stand: { name: "Zesto's Ice Cream", placeId: '1', address: '123 Maple St, Springfield, IL' },
    flavor: 'Black Raspberry',
    size: 'large',
    container: 'waffle-cone',
    toppings: ['Rainbow Sprinkles', 'Hot Fudge'],
    flavorRating: 5,
    valueRating: 4,
    notes: "Best black raspberry I've ever had. The waffle cone was perfectly crispy.",
    createdAt: new Date(Date.now() - 1000 * 60 * 45),
    user: { name: 'Chaz' },
  },
  {
    id: '2',
    stand: { name: "Dairy Queen", placeId: '2', address: '456 Oak Ave, Riverside, IL' },
    flavor: 'Cookies & Cream',
    size: 'medium',
    container: 'cup',
    toppings: ['Whipped Cream', 'Cherry'],
    flavorRating: 3,
    valueRating: 3,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    user: { name: 'Maya' },
  },
  {
    id: '3',
    stand: { name: "Sweet Peaks Creamery", placeId: '3', address: '789 Pine Rd, Lakewood, IL' },
    flavor: 'Salted Caramel',
    size: 'small',
    container: 'sugar-cone',
    toppings: ['Caramel', 'Chopped Nuts'],
    flavorRating: 5,
    valueRating: 5,
    notes: 'Tiny stand but absolutely worth the drive.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
    user: { name: 'Jordan' },
  },
  {
    id: '4',
    stand: { name: "The Creamery on Main", placeId: '4', address: '22 Main St, Evanston, IL' },
    flavor: 'Mint Chip',
    size: 'large',
    container: 'dish',
    toppings: ['Hot Fudge', 'Crushed Oreos', 'Whipped Cream'],
    flavorRating: 4,
    valueRating: 2,
    notes: 'Great flavor but the large is somehow smaller than everywhere else.',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    user: { name: 'Sam' },
  },
  {
    id: '5',
    stand: { name: "Rita's Water Ice", placeId: '5', address: '55 Boardwalk Blvd, Waukegan, IL' },
    flavor: 'Lemon Sorbet',
    size: 'kids',
    container: 'cup',
    toppings: [],
    flavorRating: 4,
    valueRating: 5,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30),
    user: { name: 'Priya' },
  },
  {
    id: '6',
    stand: { name: "Andy's Frozen Custard", placeId: '6', address: '10 Lake Shore Dr, Chicago, IL' },
    flavor: 'Concrete Mixer: Brownie Fudge',
    size: 'xl',
    container: 'cup',
    toppings: ['Hot Fudge', 'Gummy Bears', 'Marshmallows'],
    flavorRating: 5,
    valueRating: 4,
    notes: "It's a lot. It's worth it.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
    user: { name: 'Chaz' },
  },
];

export default function ScoopFeed() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-stone-900">Recent Scoops</h2>
        <span className="text-sm text-stone-400">Community feed</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SCOOPS.map((scoop) => (
          <ScoopCard key={scoop.id} scoop={scoop} />
        ))}
      </div>
    </section>
  );
}
