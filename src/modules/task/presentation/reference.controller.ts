import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppPrismaService } from '../../../shared/infrastructure/prisma/app-prisma.service';
import { SessionGuard } from '../../../shared/infrastructure/auth/guards/session.guard';

@Controller('reference')
export class ReferenceController {
  constructor(private prisma: AppPrismaService) {}

  @Get('categories')
  async getCategories() {
    return this.prisma.category.findMany({
      where: { isPredefined: true },
      orderBy: { name: 'asc' },
    });
  }

  @Get('units')
  async getUnits() {
    return this.prisma.taskUnit.findMany({
      where: { isPredefined: true },
      orderBy: { name: 'asc' },
    });
  }

  @Get('task-templates')
  @UseGuards(SessionGuard)
  async getTaskTemplates() {
    return this.prisma.task.findMany({
      where: { isPredefined: true },
      include: {
        habitDetails: true,
        routineDetails: true,
        mindsetDetails: true,
        category: true,
      },
    });
  }
}
