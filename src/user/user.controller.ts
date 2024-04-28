import {
  Body,
  Controller,
  UseGuards,
  Query,
  Get,
  Delete,
  Post,
  Req,
} from '@nestjs/common'; // Import Req decorator
import { UserService } from './user.service';
import { GetPublicKeyDto, UploadIpfsDto } from './dto';
import { DeleteUserDto } from './dto';
import { AccessTokenGuard } from '../auth/guards';

@Controller('users')
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Get('target-publickey')
  @UseGuards(AccessTokenGuard)
  async getPublicKey(@Query() getPublicKeyDto: GetPublicKeyDto) {
    return this.usersService.getPublicKey(getPublicKeyDto);
  }

  @Delete('delete-user')
  async deleteUser(@Body() query: DeleteUserDto) {
    return this.usersService.delete(query);
  }

  @Post('send-mail')
  @UseGuards(AccessTokenGuard)
  async uploadFile(@Req() req, @Body() uploadIpfsDto: UploadIpfsDto) {
    return this.usersService.uploadFile(req, uploadIpfsDto);
  }

  @Get('send/mail')
  async sendMail() {
    return this.usersService.getAll();
  }
}
