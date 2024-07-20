import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';

import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

import { Cart } from './entity/Cart';
import { CartItem } from './entity/CartItem';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database-instance.cdqcq2ckwnmf.eu-west-1.rds.amazonaws.com',
      port: 5432,
      username: 'postgres',
      password: 'system_))_',
      database: 'database_carts',
      entities: [Cart, CartItem],
      synchronize: true,
      autoLoadEntities: true,
      ssl: {
            rejectUnauthorized: false
        }
    }),
    AuthModule,
    CartModule,
    OrderModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
