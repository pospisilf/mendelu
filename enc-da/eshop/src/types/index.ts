export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export interface Order {
  id: number;
  userId?: number;
  items: CartItem[];
  total: number;
  email: string;
  status: 'pending' | 'confirmed' | 'shipped';
  createdAt: string;
} 