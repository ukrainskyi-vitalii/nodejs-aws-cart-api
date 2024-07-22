import { Controller, Get, Delete, Put, Body, Req, Post, UseGuards, HttpStatus } from '@nestjs/common';

// import { BasicAuthGuard, JwtAuthGuard } from '../auth';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';

import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

import { CartItem } from '../entity/CartItem';

@Controller('profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
//     private orderService: OrderService
  ) { }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const cart = await this.cartService.findOpenCartByUserId(getUserIdFromRequest(req));

    if (!cart || !cart.items) {
      return [];
    }

    return cart.items?.map((item: CartItem) => ({
      product: {
        id: item.product.id,
        title: item.product.title,
        description: item.product.description,
        price: item.product.price,
      },
      count: item.count,
    }));
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
  @Put()
  async updateUserCart(@Req() req: AppRequest, @Body() body) {
    const { product, count } = body;
    const items = [{
      product_id: product.id,
      count: count,
      product_title: product.title,
      product_description: product.description,
      product_price: product.price
    }];
    const cart = await this.cartService.updateByUserId(getUserIdFromRequest(req), items);
    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart),
      }
    };
  }


  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
//   @Delete()
//   clearUserCart(@Req() req: AppRequest) {
//     this.cartService.removeByUserId(getUserIdFromRequest(req));
//
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'OK',
//     }
//   }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(BasicAuthGuard)
//   @Post('checkout')
//   checkout(@Req() req: AppRequest, @Body() body) {
//     const userId = getUserIdFromRequest(req);
//     const cart = this.cartService.findByUserId(userId);
//
//     if (!(cart && cart.items.length)) {
//       const statusCode = HttpStatus.BAD_REQUEST;
//       req.statusCode = statusCode
//
//       return {
//         statusCode,
//         message: 'Cart is empty',
//       }
//     }
//
//     const { id: cartId, items } = cart;
//     const total = calculateCartTotal(cart);
//     const order = this.orderService.create({
//       ...body, // TODO: validate and pick only necessary data
//       userId,
//       cartId,
//       items,
//       total,
//     });
//     this.cartService.removeByUserId(userId);
//
//     return {
//       statusCode: HttpStatus.OK,
//       message: 'OK',
//       data: { order }
//     }
//   }
}
