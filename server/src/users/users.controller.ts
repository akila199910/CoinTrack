import { Body, Controller, Get, HttpStatus, Post, Put, Req, Res, UsePipes, ValidationPipe, UseGuards, ConflictException } from '@nestjs/common';
import type { Response } from 'express';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Controller('users')
export class UsersController {

    private upload: multer.Multer;

    constructor(
        private readonly usersService: UsersService,
    ) {
        
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        this.upload = multer({
            storage: multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, uploadsDir);
                },
                filename: (req, file, cb) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
                },
            }),
            fileFilter: (req, file, cb) => {
                // Accept only image files
                if (file.mimetype.startsWith('image/')) {
                    cb(null, true);
                } else {
                    cb(null, false);
                }
            },
            limits: {
                fileSize: 5 * 1024 * 1024, // 5MB limit
            },
        });
    }

    @Post()
    @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
    async create(@Body() dto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.usersService.create(dto);
            return res.status(HttpStatus.CREATED).json({
                status: true,
                data: user,
                message: 'User created successfully'
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

    @Get('my-profile')
    @UseGuards(JwtAuthGuard)    
    async myProfile(@Req() req: any, @Res() res: Response) {
        try {
            const data = await this.usersService.myProfile(req.user.sub);

            if (!data) {
                return res.status(HttpStatus.NOT_FOUND).json({
                    status: false,
                    data: [],
                    message: 'Profile not found'
                });
            }
            return res.status(HttpStatus.OK).json({
                status: true,
                data,
                message: 'Profile fetched successfully'
            });
        } catch (error) {
            
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                data: [],
                message: 'Internal server error'
            });
        }
    }

    @Put('my-profile')
    @UseGuards(JwtAuthGuard)
    async updateProfile(@Req() req: any, @Body() updateData: any, @Res() res: Response) {
        try {
            const data = await this.usersService.updateProfile(req.user.sub, updateData);
            return res.status(HttpStatus.OK).json({
                status: true,
                data,
                message: 'Profile updated successfully'
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                data: [],
                message: 'Failed to update profile'
            });
        }
    }

    @Put('my-profile/avatar')
    @UseGuards(JwtAuthGuard)
    async updateAvatar(@Req() req: any, @Res() res: Response) {
        try {
            
            this.upload.single('image')(req, res, async (err) => {
                if (err) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        status: false,
                        data: [],
                        message: 'File upload error: ' + err.message
                    });
                }

                const file = req.file;
                if (!file) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        status: false,
                        data: [],
                        message: 'No image file provided'
                    });
                }

                try {
                    const data = await this.usersService.updateAvatar(req.user.sub, file.filename);
                    return res.status(HttpStatus.OK).json({
                        status: true,
                        data,
                        message: 'Avatar updated successfully'
                    });
                } catch (error) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        status: false,
                        data: [],
                        message: 'Failed to update avatar'
                    });
                }
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                data: [],
                message: 'Failed to update avatar'
            });
        }
    }

    @Put('my-profile/cover')
    @UseGuards(JwtAuthGuard)
    async updateCover(@Req() req: any, @Res() res: Response) {
        try {
            // Use the file upload middleware
            this.upload.single('image')(req, res, async (err) => {
                if (err) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        status: false,
                        data: [],
                        message: 'File upload error: ' + err.message
                    });
                }

                const file = req.file;
                if (!file) {
                    return res.status(HttpStatus.BAD_REQUEST).json({
                        status: false,
                        data: [],
                        message: 'No image file provided'
                    });
                }

                try {
                    const data = await this.usersService.updateCover(req.user.sub, file.filename);
                    return res.status(HttpStatus.OK).json({
                        status: true,
                        data,
                        message: 'Cover image updated successfully'
                    });
                } catch (error) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                        status: false,
                        data: [],
                        message: 'Failed to update cover image'
                    });
                }
            });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                status: false,
                data: [],
                message: 'Failed to update cover image'
            });
        }
    }

}

