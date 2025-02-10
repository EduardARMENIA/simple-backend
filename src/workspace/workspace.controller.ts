import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
  Query,
  HttpException,
  UseGuards,
} from '@nestjs/common';
import { CreateWorkspaceDto } from '../dto/create.workspace.dto';
import { WorkspaceService } from './workspace.service';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) { }

  @UseGuards(AuthGuard("jwt"))
  @Get('check-slug')
  async checkSlugAvailability(@Query('slug') slug: string) {
    let counter = 1;
    let availableSlugs: Array<string> = []

    if(!await this.workspaceService.isSlugTaken(slug)) {
      return { isSlugAvailable: true};
    }

    for(let i = 0; i < 3; i++) {
      counter++;
      if(!await this.workspaceService.isSlugTaken(`${slug}${counter}`)) {
        availableSlugs.push(`${slug}${counter}`);
      }
    }

    return { isSlugAvailable: false,  availableSlugs: availableSlugs};
  }

  @UseGuards(AuthGuard("jwt"))
  @Post()
  async createWorkspace(@Res() response, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    try {
      const newWorkspace = await this.workspaceService.createWorkspace(createWorkspaceDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Workspace has been created successfully',
        newWorkspace,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Workspace not created!',
        error: 'Bad Request'
      });
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Get()
  async getWorkspaces(@Res() response) {
    try {
      const workspacesData = await this.workspaceService.getAllWorkspaces();
      return response.status(HttpStatus.OK).json({
        message: 'All workspaces data found successfully',workspacesData});
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @UseGuards(AuthGuard("jwt"))
  @Get('/:id')
  async getWorkspaceByUserId(@Res() response, @Param('id') userId: string) {
    try {
      const workspacesData = await this.workspaceService.getSWorkspaceByUserId(userId);

      return response.status(HttpStatus.OK).json({
        message: 'Workspace found successfully',workspacesData,});
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete('/:id')
  async deleteWorkspace(@Res() response, @Param('id') workspaceId: string)
  {
    try {
      const deletedWorkspace = await this.workspaceService.deleteWorkspace(workspaceId);
      return response.status(HttpStatus.OK).json({
        message: 'Workspace deleted successfully',
        deletedWorkspace,
      });
    }catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
