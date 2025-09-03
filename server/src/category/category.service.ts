import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CategoryService {

  constructor( @InjectRepository(Category) private readonly categoryRepository: Repository<Category>) {}
  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    try {
        const category = this.categoryRepository.create({
          ...createCategoryDto,
          user: { id: userId } // Associate the category with the user
        });
        await this.categoryRepository.save(category);
        return category;
    } catch (error) {
      throw error;
    }
  }

  async findAll(userId: number) {
    return this.categoryRepository.find({
      where: { user: { id: userId } },
      select: ['id', 'name', 'description', 'status', 'type', 'image', 'createdAt', 'updatedAt']
    });
  }

  async findOne(id: number) {
    return this.categoryRepository.findOne({
      where: { id: id },
      select: ['id', 'name', 'description', 'status', 'type', 'image', 'createdAt', 'updatedAt']
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, userId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: id, user: { id: userId } },
    });
    if (!category) {
      return null;
    }
    
    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.description !== undefined) {
      category.description = updateCategoryDto.description;
    }
    if (updateCategoryDto.status !== undefined) {
      category.status = updateCategoryDto.status;
    }
    if (updateCategoryDto.type !== undefined) {
      category.type = updateCategoryDto.type;
    }
    
    return this.categoryRepository.save(category);
  }

  async remove(id: number, userId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: id, user: { id: userId } },
      relations: ['user']
    });
    if (!category) {
      return null;
    }
    await this.categoryRepository.remove(category);
    return true;
  }
}
