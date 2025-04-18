import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(
    @Body() body: { email: string; password: string; name: string },
  ) {
    return await this.authService.signUp(body.email, body.password, body.name)
  }

  @Post('signin')
  async signIn(@Body() body: { email: string; password: string }) {
    return await this.authService.signIn(body.email, body.password)
  }
}
