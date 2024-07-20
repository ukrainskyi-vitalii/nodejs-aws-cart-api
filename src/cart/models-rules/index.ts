import { Cart, CartItem } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  return cart ? cart.items.reduce((acc: number, { count }) => {
    return acc += count * 10; // Replace 10 with the actual product price logic
  }, 0) : 0;
}