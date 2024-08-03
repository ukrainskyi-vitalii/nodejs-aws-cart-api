import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../entity/Order';
import { Cart } from '../entity/Cart';
import { CartItem } from '../entity/CartItem';
import { User } from '../entity/User';
import { OrderService } from './services';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users';

@Module({
    imports: [
        TypeOrmModule.forFeature([Order, Cart, CartItem, User]),
        CartModule,
        UsersModule
    ],
    providers: [OrderService, UsersService],
    controllers: [OrderController],
})
export class OrderModule {
}
