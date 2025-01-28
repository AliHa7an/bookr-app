import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopsService } from 'src/shops/shops.service';
import { Role } from './entities/role.entity';
import { CustomerPreferredServiceCategory } from './entities/customer-preferred-service-category.entity';
import { StaffAvailabilityOverride } from './entities/staff-availability-override.entity';
import { StaffAvailability } from './entities/staff-availabiity.entity';
import { StaffServiceCategory } from './entities/staff-service-category.entity';
import { ServiceCategoriesModule } from 'src/service-categories/service-categories.module';
import { ShopsModule } from 'src/shops/shops.module';
import { UserVerification } from './entities/user-verifications.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserVerification, Role, StaffAvailabilityOverride, StaffAvailability, StaffServiceCategory, CustomerPreferredServiceCategory]), ServiceCategoriesModule, ShopsModule],
  providers: [UserService, UserResolver],
  exports: [UserService]
})
export class UserModule {}
