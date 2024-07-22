import { Cart } from '../../entity/Cart';

export type Order = {
  id?: string,
  userId: string;
  cart: Cart;
//   items: CartItem[]
  payment: {
    type: string,
    address?: any,
    creditCard?: any,
  },
  delivery: {
    type: string,
    address: any,
    firstName?: string,
    lastName?: string,
  },
  comments: string,
  status: string;
  total: number;
}
