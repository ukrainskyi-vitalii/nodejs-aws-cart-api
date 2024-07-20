import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { Cart } from '../../entity/Cart';
import { CartStatuses } from '../models';

@Injectable()
export class CartService {
  private userCarts: Record<string, Cart> = {};

  constructor(
    @InjectRepository(Cart)
    private cartsRepository: Repository<Cart>,
  ) {}

  async findByUserId(userId: string): Promise<Cart> {
    return await this.cartsRepository.findOne({ where: { user_id: userId }, relations: ['items'] });
  }

//   async findByUserId(userId: string): Promise<Cart[]> {
//     return await this.cartsRepository.find({
//       where: { user_id: userId },
//       relations: ['items'],
//     });
//   }

  // createByUserId(userId: string) {
  //   const id = v4();
  //   const now = new Date().toISOString();
  //   const userCart = {
  //     id,
  //     user_id: userId,
  //     created_at: now,
  //     updated_at: now,
  //     status: CartStatuses.OPEN,
  //     items: [],
  //   };
  //
  //   this.userCarts[ userId ] = userCart;
  //
  //   return userCart;
  // }

  // findOrCreateByUserId(userId: string): Cart {
  //   const userCart = this.findByUserId(userId);
  //
  //   if (userCart) {
  //     return userCart;
  //   }
  //
  //   return this.createByUserId(userId);
  // }

  // updateByUserId(userId: string, { items }: Cart): Cart {
  //   const { id, ...rest } = this.findOrCreateByUserId(userId);
  //
  //   const updatedCart = {
  //     id,
  //     ...rest,
  //     items: [ ...items ],
  //   }
  //
  //   this.userCarts[ userId ] = { ...updatedCart };
  //
  //   return { ...updatedCart };
  // }

  // removeByUserId(userId): void {
  //   this.userCarts[ userId ] = null;
  // }

}
