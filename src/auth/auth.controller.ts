import { Body, Controller, Get, Param, Post, UseGuards, Headers, Req, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { RegisterDTO } from 'src/dto/register.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { LoginDTO } from '../dto/login.dto';
import { verify } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,

  ) {}


  @Get("/onlyauth")
  @UseGuards(AuthGuard("jwt"))
  async hiddenInformation(){
    return  "hidden information";
  }
  @Get("/anyone")
  async publicInformation(){
    return  "this can be seen by anyone";
  }

  @Post('register')
  async register(@Body() registerDTO: RegisterDTO) {
    const createUserDto = await this.buildCreateUserDto(registerDTO);

    const user = await this.userService.create(createUserDto);
    const payload = {
      email: user.email,
    };

    const token = await this.authService.signPayload(payload);
    return { user, token };
  }

  @Post('login')
  async login(@Body() loginDTO: LoginDTO) {
    const user = await this.userService.findByLogin(loginDTO);
    const payload = {
      email: user.email,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token};
  }

  @UseGuards(AuthGuard("jwt"))
  @Get('profile')
  async profile(@Headers('Authorization') auth?: string) {
    if (!auth || !auth.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid or missing token');
    }
    const token = auth.split(' ')[1];

    try {
      const check = verify(token, process.env.SECRET_KEY as string);
      // @ts-ignore
      let user  = await this.userService.findByEmail(check.email)

      const { _id, email, workspaces } = user

      return {
        id: _id,
        email: email,
        workspaces: workspaces,
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async buildCreateUserDto(registerDTO: RegisterDTO): Promise<RegisterDTO> {
    const hashedPassword =  registerDTO.password =  await bcrypt.hash(registerDTO.password, 10);

    return {
      email: registerDTO.email,
      password: hashedPassword
    };
  }
}