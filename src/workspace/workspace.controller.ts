import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Res, Query, HttpException } from '@nestjs/common';
import { CreateWorkspaceDto } from './create.workspace.dto';
import { WorkspaceService } from './workspace.service';

@Controller('workspace')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) { }

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


  @Post()
  async createWorkspace(@Res() response, @Body() createWorkspaceDto: CreateWorkspaceDto) {
    try {
      const newStudent = await this.workspaceService.createWorkspace(createWorkspaceDto);
      return response.status(HttpStatus.CREATED).json({
        message: 'Workspace has been created successfully',
        newStudent,
      });
    } catch (err) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: 400,
        message: 'Error: Workspace not created!',
        error: 'Bad Request'
      });
    }
  }

  @Get()
  async getWorkspaces(@Res() response) {
    try {
      const studentData = await this.workspaceService.getAllWorkspaces();
      return response.status(HttpStatus.OK).json({
        message: 'All workspaces data found successfully',studentData,});
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Get('/:id')
  async getWorkspace(@Res() response, @Param('id') workspaceId: string) {
    try {
      const existingStudent = await
        this.workspaceService.getSWorkspace(workspaceId);
      return response.status(HttpStatus.OK).json({
        message: 'Workspace found successfully',existingStudent,});
    } catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
  @Delete('/:id')
  async deleteWorkspace(@Res() response, @Param('id') studentId: string)
  {
    try {
      const deletedStudent = await this.workspaceService.deleteWorkspace(studentId);
      return response.status(HttpStatus.OK).json({
        message: 'Workspace deleted successfully',
        deletedStudent,});
    }catch (err) {
      return response.status(err.status).json(err.response);
    }
  }
}
