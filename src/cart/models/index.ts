export enum CartStatuses {
  OPEN = 'OPEN',
  ORDERED = 'ORDERED'
}

export type Product = {
  id: string,
  title: string,
  description: string,
  price: number,
};


export type CartItem = {
  cart_id: string,
  product_id: string,
  count: number,
}

export type Cart = {
  id: string,
  user_id: string,
  created_at: string,
  updated_at: string,
  status: CartStatuses,
  items: CartItem[],
}
