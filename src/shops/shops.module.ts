import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shop } from './entities/shop.entity';
import { ShopOpeningOverride } from './entities/shop-opening-overrides.entity';
import { ShopOpeningHours } from './entities/shop-hours.entity';
import { ShopsResolver } from './shops.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Shop, ShopOpeningOverride, ShopOpeningHours])],
  providers: [ShopsService, ShopsResolver],
  exports: [ShopsService]
})
export class ShopsModule {}
