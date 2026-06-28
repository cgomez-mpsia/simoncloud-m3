import {
  Body, Controller, Delete, Get, Param, Patch, Post, UseGuards,
} from '@nestjs/common';
import { DropsService } from './drops.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser, JwtPayload } from '../auth/current-user.decorator';

@Controller('api/drops')
@UseGuards(JwtAuthGuard)
export class DropsController {
  constructor(private readonly dropsService: DropsService) {}

  @Get()
  list(@CurrentUser() user: JwtPayload) {
    return this.dropsService.list(user.sub, user.role);
  }

  @Post()
  create(@Body() body: { name: string; description?: string }, @CurrentUser() user: JwtPayload) {
    return this.dropsService.create(body.name, body.description, user.sub);
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.dropsService.getOne(id);
  }

  @Patch(':id/close')
  close(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.dropsService.close(id, user.sub);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.dropsService.remove(id, user.sub);
  }

  @Get(':id/files')
  listFiles(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.dropsService.listFiles(id, user.sub, user.role);
  }
}
