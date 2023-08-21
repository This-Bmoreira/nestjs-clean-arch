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
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
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

  @ApiOperation({ summary: 'Create a new user' })
  @Post()
  async createUser(@Body() signupDto: SignupDto): Promise<OutputUser> {
    return this.signupCreate.executeSignup(signupDto);
  }

  @ApiOperation({ summary: 'User login' })
  @HttpCode(200)
  @Post('login')
  async loginUser(@Body() signInDto: SignInDto): Promise<OutputUser> {
    return this.signIn.executeSignIn(signInDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @Get()
  async getAllUsers(@Query() searchParams: DetailUsersDto) {
    return this.usersProfile.findAll(searchParams);
  }

  @ApiOperation({ summary: 'Get a user by ID' })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return this.userProfile.findOne({ id });
  }

  @ApiOperation({ summary: 'Update a user by ID' })
  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.modifyUserProfile.update({ id, ...updateUserDto });
  }

  @ApiOperation({ summary: 'Update user password by ID' })
  @Patch(':id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() passwordModificationDto: PasswordModificationDto,
  ) {
    return this.passwordModification.update({ id, ...passwordModificationDto });
  }

  @ApiOperation({ summary: 'Delete a user by ID' })
  @HttpCode(204)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.removeUserProfile.remove({ id });
  }
}
