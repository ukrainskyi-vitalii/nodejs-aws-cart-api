import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderModule } from '../order/order.module';

import { CartController } from './cart.controller';
import { CartService } from './services';

import { Cart } from '../entity/Cart';
import { CartItem } from '../entity/CartItem';
import { Product } from '../entity/Product';

@Module({
  imports: [ TypeOrmModule.forFeature([Cart, CartItem, Product]) ],
  exports: [ CartService ],
  providers: [ CartService ],
  controllers: [ CartController ],
})
export class CartModule {}
