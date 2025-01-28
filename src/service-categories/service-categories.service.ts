import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-categories.entity';
import { CreateServiceCategoryInput } from './dto/create-service.dto';
import { UpdateServiceCategoryInput } from './dto/update-service.dto';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly serviceCategoryRepository: Repository<ServiceCategory>,
  ) {}


  async createCategory(createServiceCategoryInput: CreateServiceCategoryInput): Promise<ServiceCategory> {
    const newCategory = this.serviceCategoryRepository.create(createServiceCategoryInput);
    return this.serviceCategoryRepository.save(newCategory);
  }


  async findCategoriesByNames(names: string[]): Promise<ServiceCategory[]> {
    return this.serviceCategoryRepository.find({
      where: {
        name: In(names), 
      },
    });
  }

  async findCategoriesByIds(ids: number[]): Promise<ServiceCategory[]> {
    return this.serviceCategoryRepository.find({
        where: {
          id: In(ids), 
        },
      });
  }


  async updateCategory(id: number, updateServiceCategoryInput: UpdateServiceCategoryInput): Promise<ServiceCategory> {
    const category = await this.serviceCategoryRepository.findOne({
        where: {
          id: id, 
        },
      });
    if (!category) {
      throw new Error('Service category not found');
    }
    Object.assign(category, updateServiceCategoryInput);
    return this.serviceCategoryRepository.save(category);
  }


  async deleteCategory(id: number): Promise<boolean> {
    const result = await this.serviceCategoryRepository.delete(id);
    return result.affected > 0;
  }


  async findAllCategories(): Promise<ServiceCategory[]> {
    return this.serviceCategoryRepository.find();
  }

  async findCategoryById(id: number): Promise<ServiceCategory | undefined> {
    return this.serviceCategoryRepository.findOne({
        where: {
          id: id, 
        },
      });
  }
}
