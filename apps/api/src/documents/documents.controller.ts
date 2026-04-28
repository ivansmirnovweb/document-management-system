import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserRole } from '@document-flow/shared';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { AuthenticatedUser } from '../auth/auth.types';
import { CreateDocumentDto } from './dto/create-document.dto';
import { ListDocumentsQueryDto } from './dto/list-documents-query.dto';
import { SearchDocumentsQueryDto } from './dto/search-documents-query.dto';
import { ReassignDocumentDto } from './dto/reassign-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { UpdateDocumentStatusDto } from './dto/update-document-status.dto';
import { CreateResolutionDto } from './dto/create-resolution.dto';
import { UpdateResolutionDto } from './dto/update-resolution.dto';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Public()
  @Get('public')
  listPublic() {
    return this.documentsService.listPublic();
  }

  @Public()
  @Get('public/:id')
  getPublicById(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.getPublicById(id);
  }

  @Get()
  list(@Query() query: ListDocumentsQueryDto) {
    return this.documentsService.list(query);
  }

  @Get('search')
  search(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: SearchDocumentsQueryDto,
  ) {
    return this.documentsService.search(user, query);
  }

  @Get('completed')
  listCompleted() {
    return this.documentsService.listCompleted();
  }

  @Roles(UserRole.ROOT)
  @Get('deleted')
  listDeleted(@CurrentUser() user: AuthenticatedUser) {
    return this.documentsService.listDeleted(user);
  }

  @Get(':id')
  getById(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.getById(id, user);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateDocumentDto,
  ) {
    return this.documentsService.create(user, dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateDocumentDto,
  ) {
    return this.documentsService.update(id, user, dto);
  }

  @Roles(UserRole.ROOT)
  @Patch(':id/reassign')
  reassignOwner(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: ReassignDocumentDto,
  ) {
    return this.documentsService.reassignOwner(id, user, dto);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateDocumentStatusDto,
  ) {
    return this.documentsService.changeStatus(id, user, dto.status);
  }

  @Post(':id/resolutions')
  createResolution(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateResolutionDto,
  ) {
    return this.documentsService.createResolution(id, user, dto);
  }

  @Patch(':id/resolutions/:resolutionId')
  updateResolution(
    @Param('id', ParseIntPipe) id: number,
    @Param('resolutionId', ParseIntPipe) resolutionId: number,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateResolutionDto,
  ) {
    return this.documentsService.updateResolution(id, resolutionId, user, dto);
  }

  @Delete(':id/resolutions/:resolutionId')
  deleteResolution(
    @Param('id', ParseIntPipe) id: number,
    @Param('resolutionId', ParseIntPipe) resolutionId: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.deleteResolution(id, resolutionId, user);
  }

  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.remove(id, user);
  }

  @Roles(UserRole.ROOT)
  @Patch(':id/restore')
  restore(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.restore(id, user);
  }

  @Roles(UserRole.ROOT)
  @Delete(':id/hard')
  hardDelete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    return this.documentsService.hardDelete(id, user);
  }
}
