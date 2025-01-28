import { Module } from '@nestjs/common';
import { ServiceCategoriesService } from './service-categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceCategory } from './entities/service-categories.entity';
import { ServiceCategoriesResolver } from './service-categories.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceCategory])],
  providers: [ServiceCategoriesService, ServiceCategoriesResolver],
  exports: [ServiceCategoriesService]
})
export class ServiceCategoriesModule {}
