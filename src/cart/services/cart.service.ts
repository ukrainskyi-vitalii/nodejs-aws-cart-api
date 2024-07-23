import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {Cart} from '../../entity/Cart';
import {CartItem} from '../../entity/CartItem';
import {Product} from '../../entity/Product';
import {CartStatuses} from '../models';

@Injectable()
export class CartService {
    private userCarts: Record<string, Cart> = {};

    constructor(
        @InjectRepository(Cart)
        private cartsRepository: Repository<Cart>,
        @InjectRepository(CartItem)
        private cartItemsRepository: Repository<CartItem>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
    ) {
    }

    async findByUserId(userId: string): Promise<Cart> {
        return await this.cartsRepository.findOne({where: {user_id: userId}, relations: ['items', 'items.product']});
    }

    async createByUserId(userId: string, queryRunner?): Promise<Cart> {
        const id = uuidv4();
        const now = new Date().toISOString();
        const userCart = this.cartsRepository.create({
            id,
            user_id: userId,
            created_at: now,
            updated_at: now,
            status: CartStatuses.OPEN,
            items: [],
        });

        if (queryRunner) {
            return await queryRunner.manager.save(Cart, userCart);
        }
        return await this.cartsRepository.save(userCart);
    }

    async findOrCreateByUserId(userId: string, queryRunner?): Promise<Cart> {
        let cart = await this.findOpenCartByUserId(userId, queryRunner);

        if (!cart) {
            cart = await this.createByUserId(userId, queryRunner);
        }

        return cart;
    }

    async updateByUserId(userId: string, items: any[]): Promise<Cart> {
        const cart = await this.findOrCreateByUserId(userId);
        for (const item of items) {
            let productEntity = await this.productRepository.findOne({ where: { id: item.product_id } });
            if (!productEntity) {
                productEntity = this.productRepository.create({
                    id: item.product_id,
                    title: item.product_title,
                    description: item.product_description,
                    price: item.product_price,
                });
                productEntity = await this.productRepository.save(productEntity);
            }

            let existingItem = cart.items.find(cartItem => cartItem.product.id === item.product_id);
            if (existingItem) {
                if (item.count === 0) {
                    await this.cartItemsRepository.remove(existingItem);
                    cart.items = cart.items.filter(cartItem => cartItem.product.id !== item.product_id);
                } else {
                    existingItem.count = item.count;
                    await this.cartItemsRepository.save(existingItem);
                }
            } else {
                if (item.count > 0) {
                    const newItem = this.cartItemsRepository.create({
                        cart: cart,
                        product: productEntity,
                        count: item.count,
                    });
                    const savedItem = await this.cartItemsRepository.save(newItem);
                    if (!savedItem.cart || !savedItem.product) {
                        console.error('Failed to save cart item:', savedItem);
                    } else {
                        cart.items.push(savedItem);
                    }
                }
            }
        }

        cart.updated_at = new Date().toISOString();
        return await this.cartsRepository.save(cart);
    }

    async findOpenCartByUserId(userId: string, queryRunner?): Promise<Cart> {
        if (queryRunner) {
            return await queryRunner.manager.findOne(Cart, {
                where: { user_id: userId, status: CartStatuses.OPEN },
                relations: ['items', 'items.product'],
            });
        }
        return await this.cartsRepository.findOne({
            where: { user_id: userId, status: CartStatuses.OPEN },
            relations: ['items', 'items.product'],
        });
    }

    // removeByUserId(userId): void {
    //   this.userCarts[ userId ] = null;
    // }

}
