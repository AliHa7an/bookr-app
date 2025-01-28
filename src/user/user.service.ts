import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { AddStaffInput } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { SignupInput } from 'src/auth/dto/singup.dto';
import { ServiceCategoriesService } from 'src/service-categories/service-categories.service';
import { ShopsService } from 'src/shops/shops.service';
import { CustomerPreferredServiceCategory } from './entities/customer-preferred-service-category.entity';
import { Role } from './entities/role.entity';
import { USER_ROLE_ENUM } from 'src/types/role-type.enum';
import { UserVerification } from './entities/user-verifications.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private readonly serviceCategoryService: ServiceCategoriesService,
    private readonly shopService: ShopsService,
    @InjectRepository(UserVerification)
    private verificationCodeRepository: Repository<UserVerification>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }


  async findOne(id: number): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations: ["role"] });
  }

  
  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    if (user) {
      await this.userRepository.remove(user);
    } else {
      throw new Error('User not found');
    }
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email }, relations: ["role"] });
    
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    
    return null;
  }

  async createUser(signupInput: SignupInput): Promise<User> {
    const { password, preferredServiceCategories, role, ...userData } = signupInput;
    let hashedPassword;
    if(password) {
     hashedPassword = await bcrypt.hash(password, 10); 
    }
    const existingRole = await this.roleRepository.findOne({ where: { name: role }
    });

    if(!existingRole) {
      throw new Error("Provided role not exist")
    }

    const user = this.userRepository.create({
      ...userData,
      role: existingRole,
      password: hashedPassword ? hashedPassword : null,
    });

    if (preferredServiceCategories && preferredServiceCategories.length > 0) {
    const categories = await this.serviceCategoryService.findCategoriesByIds(preferredServiceCategories);
    
    user.preferredServiceCategories = categories.map((category) => {
      const preferredCategory = new CustomerPreferredServiceCategory();
      preferredCategory.customer = user;
      preferredCategory.serviceCategory = category;
      return preferredCategory;
    });
}
    
    const createdUser = await this.userRepository.save(user);
    return this.findOne(createdUser.id)
  }

  async addStaff(addStaffInput: AddStaffInput): Promise<User> {
    const { password, staffServiceCategories, shopId, ...userData } = addStaffInput;
    const shop = await this.shopService.findOne(shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }
  
    let serviceCategories = [];
    if (staffServiceCategories) {
      serviceCategories = await this.serviceCategoryService.findCategoriesByIds(staffServiceCategories);
      if (serviceCategories.length < staffServiceCategories.length) {
        throw new Error('One or more service categories are invalid');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10); 
 
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      staffServiceCategories: serviceCategories,
    });

    return this.userRepository.save(user);
  }

  async findBySocialId(socialProvider: string, socialId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { socialProvider, socialId },
    });
  }
  

  async createDefaultRoles(): Promise<Role[]> {
    const existingRoles = await this.roleRepository.find();
    if (existingRoles.length > 0) {
      console.log('Roles already exist in the database');
      return existingRoles;
    }

    const roles = Object.values(USER_ROLE_ENUM).map((roleName) => {
      const role = this.roleRepository.create({
        name: roleName,
      });
      return role;
    });

    return this.roleRepository.save(roles);
  }

  async generateVerificationCode(user: User): Promise<UserVerification> {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); 
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Code expires in 10 minutes

    const verificationCode = this.verificationCodeRepository.create({
      user,
      code,
      expiresAt,
    });

    return this.verificationCodeRepository.save(verificationCode);
  }

  async validateVerificationCode(userId: number, code: string): Promise<boolean> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: {
        user: { id: userId },
        code,
        isUsed: false,
      },
    });

    if (!verificationCode) {
      return false;
    }

    const now = new Date();
    if (verificationCode.expiresAt < now) {
      throw new Error('Verification code has expired');
    }

    return true;
  }


  async markCodeAsUsed(userId: number, code: string): Promise<void> {
    const verificationCode = await this.verificationCodeRepository.findOne({
      where: {
        user: { id: userId },
        code,
        isUsed: false,
      },
    });

    if (verificationCode) {
      verificationCode.isUsed = true;
      await this.verificationCodeRepository.save(verificationCode);
    }
  }

  async resetPassword(userId: number, code: string, newPassword: string): Promise<void> {
    const isValid = await this.validateVerificationCode(userId, code);
    if (!isValid) {
      throw new Error('Invalid or expired verification code');
    }

    const user = await this.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await this.userRepository.save(user);

    await this.markCodeAsUsed(userId, code);
  }

  async updateUser(id: number, updateUserDto: Partial<UpdateUserDto>): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new Error('User not found');
    }
  
    // Update fields dynamically based on the provided `updateUserDto`
    const { password, ...otherFields } = updateUserDto;
  
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
  
    Object.entries(otherFields).forEach(([key, value]) => {
      if (value !== undefined) {
        user[key] = value;
      }
    });
  
    return this.userRepository.save(user);
  }
  
}
