import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  Param, 
  UseGuards, 
  Delete, 
  Patch 
} from '@nestjs/common';
import { EssayService } from './essay.service';
import { JwtGuard } from 'src/common/decorators/jwt.guard';
import { GetUser } from 'src/common/guard/get-user.decorator';

@Controller('essays')
export class EssayController {
  constructor(private readonly essayService: EssayService) {}

  // 🔹 Submit essay
  @UseGuards(JwtGuard)
  @Post('submit')
  async submitEssay(
    @GetUser('sub') userId: number,
    @Body() body: {
      promptId?: number;
      question?: string;
      taskType?: string;
      text: string;
    },
  ) {
    return this.essayService.submitEssay(userId, body);
  }

  // 🔹 Get single essay
  @UseGuards(JwtGuard)
  @Get(':id')
  async getEssay(@Param('id') id: string, @GetUser('sub') userId: number) {
    return this.essayService.getEssay(Number(id), userId);
  }

  // 🔹 List all essays of current user
  @UseGuards(JwtGuard)
  @Get()
  async listEssays(@GetUser('sub') userId: number) {
    return this.essayService.listEssays(userId);
  }

  // 🔹 Delete essay (chỉ khi PENDING)
  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteEssay(@Param('id') id: string, @GetUser('sub') userId: number) {
    return this.essayService.deleteEssay(Number(id), userId);
  }

  // 🔹 Retry grading essay
  @UseGuards(JwtGuard)
  @Patch(':id/retry')
  async retryEssay(@Param('id') id: string, @GetUser('sub') userId: number) {
    return this.essayService.retryGrading(Number(id), userId);
  }

  // 🔹 Check duplicate essay by text
  @UseGuards(JwtGuard)
  @Post('check-duplicate')
  async checkDuplicate(@Body('text') text: string) {
    return this.essayService.checkDuplicateEssay(text);
  }
}
