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
import { FolderInput } from './file-manager.domain';

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
}
