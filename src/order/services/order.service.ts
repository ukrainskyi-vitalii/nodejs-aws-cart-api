import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Order} from '../../entity/Order';
import {Cart} from '../../entity/Cart';
import {CartItem} from '../../entity/CartItem';
import {CartStatuses} from "../../cart";

@Injectable()
export class OrderService {
    private orders: Record<string, Order> = {}

    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(Cart)
        private readonly cartRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private readonly cartItemRepository: Repository<CartItem>,
    ) {
    }

    async findById(id: string): Promise<Order> {
        return await this.orderRepository.findOne({
            where: {id},
            relations: ['cart', 'cart.items', 'cart.items.product']
        });
    }

    async create(orderData: Partial<Order>): Promise<Order> {
        const order = this.orderRepository.create(orderData);
        const savedOrder = await this.orderRepository.save(order);
        const cart = savedOrder.cart;
        cart.status = CartStatuses.ORDERED;
        await this.updateCartStatus(cart);

        return savedOrder;
    }

    async updateCartStatus(cart: Cart): Promise<Cart> {
        cart.updated_at = new Date().toISOString();
        return await this.cartRepository.save(cart);
    }

    async findAllWithDetails(): Promise<Order[]> {
        return await this.orderRepository.find({relations: ['cart', 'cart.items']});
    }

    async delete(id: string): Promise<void> {
        const order = await this.findById(id);
        if (order) {
            const cartId = order.cart?.id;
            if (cartId) {
                await this.cartItemRepository.delete({cart: {id: cartId}});
                await this.orderRepository.delete(id); // Delete order first
                await this.cartRepository.delete(cartId); // Delete cart after order
            } else {
                await this.orderRepository.delete(id); // If no cart, delete order
            }
        }
    }

    async update(orderId: string, data: { status: string; comment: string }): Promise<Order> {
        const order = await this.findById(orderId);

        if (!order) {
            throw new Error('Order does not exist.');
        }

        order.status = data.status ?? '';
        order.comments = data.comment ?? '';

        await this.orderRepository.save(order);
        return order;
    }
}
