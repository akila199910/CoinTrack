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
          user: { id: userId }
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

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
        const category = await this.categoryRepository.findOne({
          where: { id: id },
        });
        if (!category) {
          return {
            status: false,
            data: [],
            message: 'Category not found'
          }
        }
        const updateCategory = await this.categoryRepository.save({...category, ...updateCategoryDto});
        return {
          status: true,
          data: updateCategory,
          message: 'Category updated successfully'
        }
      
      }catch(error) {
        return {
          status: false,
          data: [],
          errors: error,
          message: 'Internal server error while updating category'
      }
    }
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
