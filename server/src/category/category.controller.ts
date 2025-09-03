import { Controller, Get, Post, Body, Param, Delete, Res, HttpStatus, UsePipes, ValidationPipe, ConflictException, UseGuards, Req, Put } from '@nestjs/common';
import type { Response } from 'express';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  async create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: any, @Res() res: Response) {
    try {
      const userId = req.user.sub; 
      const category = await this.categoryService.create(createCategoryDto, userId);
      return res.status(HttpStatus.CREATED).json({
        status: true,
        data: category,
        message: 'Category created successfully'
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        return res.status(HttpStatus.CONFLICT).json({
          status: false,
          data: [],
          message: error.message
        });
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        message: 'Internal server error'
      });
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Req() req: any, @Res() res: Response): Promise<Response> {
    try {
      const userId = req.user.sub;
      const categories = await this.categoryService.findAll(userId);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: categories,
        message: 'Categories fetched successfully'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        message: 'Internal server error'
      });
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Res() res: Response): Promise<Response> {
    try {
      const category = await this.categoryService.findOne(+id);
      if (!category) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          data: [],
          message: 'Category not found'
        });
      }
      return res.status(HttpStatus.OK).json({
        status: true,
        data: category,
        message: 'Category fetched successfully'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        message: 'Internal server error'
      });
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: any, @Res() res: Response): Promise<Response> {
    try {
      const userId = req.user.sub;
      const category = await this.categoryService.update(+id, updateCategoryDto, userId);
      if (!category) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          data: [],
          message: 'Category not found'
        });
      }
      return res.status(HttpStatus.OK).json({
        status: true,
        data: category,
        message: 'Category updated successfully'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        message: 'Internal server error'
      });
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
    try {
      const userId = req.user.sub;
      const result = await this.categoryService.remove(+id, userId);
      if (!result) {
        return res.status(HttpStatus.NOT_FOUND).json({
          status: false,
          data: [],
          message: 'Category not found'
        });
      }
      return res.status(HttpStatus.OK).json({
        status: true,
        data: [],
        message: 'Category deleted successfully'
      });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        status: false,
        data: [],
        message: 'Internal server error'
      });
    }
  }
}
