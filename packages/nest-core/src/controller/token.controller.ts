import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { CreateTokenRequest } from '../dto/create-token.request';
import { NoAuth } from '../decorators/no-auth.decorator';
import { AuthService } from '../service/auth.service';
import { TokenVo } from '../vo/token.vo';
import { ApiResponse } from '@nestjs/swagger';

@Controller('/tokens')
export class TokenController {
  constructor(private readonly authService: AuthService) {}
  @Post()
  @NoAuth()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token',
    type: TokenVo,
  })
  create(@Body() tokenCreateRequest: CreateTokenRequest) {
    return this.authService.createToken(tokenCreateRequest);
  }
}
