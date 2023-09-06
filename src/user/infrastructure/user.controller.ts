import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { AuthGuard } from '../../auth/infrastructure/auth.guard';
import { AuthService } from '../../auth/infrastructure/auth.service';
import { OutputUser } from '../application/dto/output-user.dto';
import { DetailUserService } from '../application/use_case/detail-user.service';
import { DetailUsersService } from '../application/use_case/detail-users.service';
import { PasswordModificationService } from '../application/use_case/modify-password.service';
import { ModifyUserService } from '../application/use_case/modify-user.service';
import { RemoveUserService } from '../application/use_case/remove-user.service';
import { SignInService } from '../application/use_case/signin.service';
import { SignupService } from '../application/use_case/signup.service';
import { DetailUsersDto } from './dto/detailUsersService.dto';
import { SignInDto } from './dto/signin.dto';
import { SignupDto } from './dto/signup.dto';
import { PasswordModificationDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserCollectionPresenter,
  UserPresenter,
} from './presentation/user.presenter';

@ApiTags('user')
@Controller('user')
export class UserController {
  @Inject(SignupService.Create)
  private signupCreate: SignupService.Create;

  @Inject(SignInService.SignIn)
  private signIn: SignInService.SignIn;

  @Inject(RemoveUserService.UserProfile)
  private removeUserProfile: RemoveUserService.UserProfile;

  @Inject(ModifyUserService.UserProfileModification)
  private modifyUserProfile: ModifyUserService.UserProfileModification;

  @Inject(PasswordModificationService.passwordModification)
  private passwordModification: PasswordModificationService.passwordModification;

  @Inject(DetailUsersService.UsersProfile)
  private usersProfile: DetailUsersService.UsersProfile;

  @Inject(DetailUserService.UserProfile)
  private userProfile: DetailUserService.UserProfile;

  @Inject(AuthService)
  private authService: AuthService;

  static userToResponse(output: OutputUser) {
    return new UserPresenter(output);
  }

  static listUsersToResponse(output: DetailUsersService.Output) {
    return new UserCollectionPresenter(output);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 409,
    description: 'Conflito de e-mail',
  })
  @ApiResponse({
    status: 401,
    description: 'Corpo da requisição com dados inválidos',
  })
  async createUser(@Body() signupDto: SignupDto) {
    const output = await this.signupCreate.executeSignup(signupDto);
    return UserController.userToResponse(output);
  }
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'E-mail não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciais inválidas',
  })
  @HttpCode(200)
  async loginUser(@Body() signInDto: SignInDto) {
    const output = await this.signIn.executeSignIn(signInDto);
    return this.authService.generateJwt(output.id);
  }
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            },
          },
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(UserPresenter) },
        },
      },
    },
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  async getAllUsers(@Query() searchParams: DetailUsersDto) {
    const output = await this.usersProfile.findAll(searchParams);
    return UserController.listUsersToResponse(output);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiParam({ name: 'id', type: 'uuid', description: 'ID no formato UUID' })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  async getUserById(@Param('id') id: string) {
    const output = await this.userProfile.findOne({ id });
    return UserController.userToResponse(output);
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiParam({ name: 'id', type: 'uuid', description: 'ID no formato UUID' })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const output = await this.modifyUserProfile.update({
      id,
      ...updateUserDto,
    });
    return UserController.userToResponse(output);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update user password by ID' })
  @ApiParam({ name: 'id', type: 'uuid', description: 'ID no formato UUID' })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @UseGuards(AuthGuard)
  async updateUserPassword(
    @Param('id') id: string,
    @Body() passwordModificationDto: PasswordModificationDto,
  ) {
    const output = await this.passwordModification.update({
      id,
      ...passwordModificationDto,
    });
    return UserController.userToResponse(output);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiParam({ name: 'id', type: 'uuid', description: 'ID no formato UUID' })
  @ApiResponse({
    status: 204,
    description: 'Resposta de confirmação da exclusão',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @ApiResponse({
    status: 404,
    description: 'Id não encontrado',
  })
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deleteUser(@Param('id') id: string) {
    await this.removeUserProfile.remove({ id });
  }
}
