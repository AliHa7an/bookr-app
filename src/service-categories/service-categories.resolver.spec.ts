import { Test, TestingModule } from '@nestjs/testing';
import { ServiceCategoriesResolver } from './service-categories.resolver';

describe('ServiceCategoriesResolver', () => {
  let resolver: ServiceCategoriesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceCategoriesResolver],
    }).compile();

    resolver = module.get<ServiceCategoriesResolver>(ServiceCategoriesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
