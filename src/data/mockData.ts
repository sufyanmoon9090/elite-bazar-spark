export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  description?: string;
  /** ADMIN ONLY — supplier/source product link (never rendered on public pages) */
  supplierUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "📱", count: 2450 },
  { id: "fashion", name: "Fashion", icon: "👗", count: 1890 },
  { id: "home", name: "Home & Living", icon: "🏠", count: 1240 },
  { id: "accessories", name: "Accessories", icon: "⌚", count: 980 },
  { id: "beauty", name: "Beauty", icon: "💄", count: 760 },
  { id: "gadgets", name: "Gadgets", icon: "🎮", count: 1120 },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    price: 299.99,
    originalPrice: 399.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80",
      "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600&q=80",
    ],
    category: "electronics",
    rating: 4.8,
    reviews: 342,
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Smart Watch Ultra",
    price: 449.99,
    originalPrice: 549.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
      "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=600&q=80",
      "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&q=80",
    ],
    category: "gadgets",
    rating: 4.9,
    reviews: 567,
    badge: "New",
  },
  {
    id: "3",
    name: "Designer Leather Bag",
    price: 189.99,
    originalPrice: 249.99,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80",
    ],
    category: "fashion",
    rating: 4.7,
    reviews: 213,
    badge: "Trending",
  },
  {
    id: "4",
    name: "Minimalist Desk Lamp",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    category: "home",
    rating: 4.5,
    reviews: 189,
  },
  {
    id: "5",
    name: "Luxury Perfume Set",
    price: 129.99,
    originalPrice: 179.99,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
      "https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=600&q=80",
    ],
    category: "beauty",
    rating: 4.6,
    reviews: 421,
    badge: "Sale",
  },
  {
    id: "6",
    name: "Wireless Charging Pad",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1586953208270-767889fa9237?w=400&q=80",
    category: "accessories",
    rating: 4.4,
    reviews: 156,
  },
  {
    id: "7",
    name: "Noise Cancelling Earbuds",
    price: 199.99,
    originalPrice: 259.99,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&q=80",
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&q=80",
    ],
    category: "electronics",
    rating: 4.7,
    reviews: 298,
    badge: "Hot Deal",
  },
  {
    id: "8",
    name: "Handcrafted Ceramic Vase",
    price: 64.99,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400&q=80",
    category: "home",
    rating: 4.3,
    reviews: 87,
  },
];

export const testimonials = [
  {
    id: "1",
    name: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&q=80",
    rating: 5,
    text: "Elite Bazar has completely changed my shopping experience. The quality of products is unmatched and delivery is always on time!",
    role: "Verified Buyer",
  },
  {
    id: "2",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
    rating: 5,
    text: "I've been shopping here for over a year now. The customer service is exceptional and returns are hassle-free.",
    role: "Premium Member",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80",
    rating: 4,
    text: "Amazing variety of products at competitive prices. The flash deals are incredible — I always find something great!",
    role: "Verified Buyer",
  },
];

export const blogPosts = [
  {
    id: "1",
    title: "Best Gadgets of 2026",
    excerpt: "Discover the top tech gadgets that are redefining innovation this year.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80",
    date: "Mar 5, 2026",
    category: "Tech",
  },
  {
    id: "2",
    title: "Spring Fashion Trends",
    excerpt: "Stay ahead of the curve with these must-have fashion pieces for spring.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80",
    date: "Mar 2, 2026",
    category: "Fashion",
  },
  {
    id: "3",
    title: "Smart Home Buying Guide",
    excerpt: "Everything you need to transform your home into a smart living space.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&q=80",
    date: "Feb 28, 2026",
    category: "Home",
  },
];
