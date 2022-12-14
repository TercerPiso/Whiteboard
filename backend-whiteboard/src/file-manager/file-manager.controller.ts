import { FileManagerService } from './file-manager.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from '@nestjs/common';
import { FileData, FolderInput } from './file-manager.domain';

@Controller('file-manager')
export class FileManagerController {
  constructor(private readonly fmSrv: FileManagerService) {}

  @Get('folders')
  @UseGuards(JwtAuthGuard)
  getFolders(@Request() req) {
    return this.fmSrv.getAllFolders(req.user.userId);
  }

  @Post('folders')
  @UseGuards(JwtAuthGuard)
  createFolder(@Request() req, @Body() folderData: FolderInput) {
    return this.fmSrv.newFolder(req.user.userId, folderData.name);
  }

  @Put('folders/:id')
  @UseGuards(JwtAuthGuard)
  renameFolder(
    @Request() req,
    @Body() folderData: FolderInput,
    @Param('id') fid: string,
  ) {
    return this.fmSrv.updateFolder(req.user.userId, fid, folderData.name);
  }

  @Delete('folders/:id')
  @UseGuards(JwtAuthGuard)
  deleteFolder(@Request() req, @Param('id') fid: string) {
    // TODO: remove files in folder
    return this.fmSrv.deleteFolder(req.user.userId, fid);
  }

  @Get('files/:fid')
  @UseGuards(JwtAuthGuard)
  getFiles(@Request() req, @Param('fid') fid: string) {
    return this.fmSrv.getFilesInFolder(req.user.userId, fid);
  }

  @Get('file/:fid')
  @UseGuards(JwtAuthGuard)
  getFullFile(@Request() req, @Param('fid') fid: string) {
    return this.fmSrv.getFile(req.user.userId, fid);
  }

  @Post('files')
  @UseGuards(JwtAuthGuard)
  createFile(@Request() req, @Body() fileData: FileData) {
    return this.fmSrv.createFileInFolder(req.user.userId, fileData);
  }

  @Put('files/:fid')
  @UseGuards(JwtAuthGuard)
  updateFile(
    @Request() req,
    @Param('fid') fid: string,
    @Body() fileData: FileData,
  ) {
    return this.fmSrv.updateFile(req.user.userId, fid, fileData);
  }

  @Delete('files/:fid')
  @UseGuards(JwtAuthGuard)
  deleteFile(@Request() req, @Param('fid') fid: string) {
    return this.fmSrv.deleteFile(req.user.userId, fid);
  }
}
