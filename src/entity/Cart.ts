import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CartStatuses } from '../cart/models/index';
import { CartItem } from './CartItem';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  user_id: string;

  @Column('timestamp')
  created_at: string;

  @Column('timestamp')
  updated_at: string;

  @Column({
    type: 'enum',
    enum: CartStatuses,
    default: CartStatuses.OPEN
  })
  status: CartStatuses;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart, {
    cascade: true,
    eager: true,
  })
  items: CartItem[];
}
