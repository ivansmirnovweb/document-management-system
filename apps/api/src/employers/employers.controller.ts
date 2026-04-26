import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateEmployerDto } from './dto/create-employer.dto';
import { UpdateEmployerDto } from './dto/update-employer.dto';
import { EmployersService } from './employers.service';

@Controller('employers')
export class EmployersController {
  constructor(private readonly employersService: EmployersService) {}

  @Get()
  list() {
    return this.employersService.list();
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.employersService.getById(id);
  }

  @Post()
  create(@Body() dto: CreateEmployerDto) {
    return this.employersService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEmployerDto,
  ) {
    return this.employersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employersService.remove(id);
  }
}
