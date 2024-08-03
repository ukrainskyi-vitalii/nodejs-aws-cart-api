import { Body, Controller, Delete, Get, Param, Put, Req } from '@nestjs/common';
import { OrderService } from './services';
import { CartService, CartStatuses } from '../cart';
import { UsersService } from '../users';
import { Order } from '../entity/Order';
import {AppRequest, getUserIdFromRequest} from "../shared";
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Controller('order')
export class OrderController {
    constructor(
        private readonly orderService: OrderService,
        private readonly cartService: CartService,
        private readonly userService: UsersService,
        @InjectDataSource() private readonly dataSource: DataSource,
    ) {
    }

    @Put()
    async createOrder(@Req() req: AppRequest, @Body() orderData: any): Promise<Order> {
        const items = orderData.items || [];
        const delivery = orderData.address ?? {};

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            let user = await this.userService.findByFullName(delivery.firstName, delivery.lastName);
            if (!user) {
                user = await this.userService.createOne({
                    id: getUserIdFromRequest(req),
                    first_name: delivery.firstName,
                    last_name: delivery.lastName
                }, queryRunner);
            }

            let userCart = await this.cartService.findOrCreateByUserId(user.id, queryRunner);

            const formattedOrderData: Partial<Order> = {
                userId: user.id,
                cart: userCart,
                payment: orderData.payment || { type: '', address: {}, creditCard: {} },
                delivery: delivery || { type: '', address: {} },
                comments: delivery.comment || '',
                status: CartStatuses.OPEN,
                total: items.length,
            };

            const order = await this.orderService.create(formattedOrderData, queryRunner);

            await queryRunner.commitTransaction();
            return order;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Failed to create order: ' + error.message);
        } finally {
            await queryRunner.release();
        }
    }

    @Get(':id')
    async getOrder(@Param('id') id: string): Promise<any> {
        const order = await this.orderService.findById(id);

        return !order ? {} : {
            id: order.id,
            address: {
                address: order.delivery.address,
                firstName: order.delivery.firstName,
                lastName: order.delivery.lastName,
                comment: order.comments,
            },
          items: order.cart.items.map(item => {
            return {
              productId: item.product.id,
              count: item.count,
            };
          }),
            statusHistory: [
                {
                    status: order.status,
                    timestamp: new Date().toISOString(),
                    comment: order.comments,
                }
            ],
        };
    }

    @Get()
    async getAllOrders(): Promise<any> {
        const orders = await this.orderService.findAllWithDetails();
        return orders.map(order => ({
            id: order.id,
            address: {
                address: order.delivery.address,
                firstName: order.delivery.firstName,
                lastName: order.delivery.lastName,
                comment: order.comments
            },
            items: order.cart?.items?.map(item => ({
                productId: item.product,
                count: item.count
            })) || [],
            statusHistory: [
                {
                    status: order.status,
                    timestamp: new Date().toISOString(),
                    comment: order.comments
                }
            ]
        }));
    }

    @Delete(':id')
    async deleteOrder(@Param('id') id: string): Promise<{ message: string }> {
        await this.orderService.delete(id);
        return {message: 'Order deleted successfully'};
    }

    @Put(':id/status')
    async updateOrderStatus(
        @Param('id') id: string,
        @Body() updateStatusDto: { status: string; comment: string }
    ): Promise<Order> {
        return await this.orderService.update(id, updateStatusDto);
    }
}
