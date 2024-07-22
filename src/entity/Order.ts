import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './Cart';
import { User } from './User';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => Cart)
  @JoinColumn({ name: 'cartId' })
  cart: Cart;

  @Column('json')
  payment: {
    type: string,
    address?: any,
    creditCard?: any,
  };

  @Column('json')
  delivery: {
    type: string,
    address: any,
    firstName?: string,
    lastName?: string,
  };

  @Column('text')
  comments: string;

  @Column('text')
  status: string;

  @Column('float')
  total: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
