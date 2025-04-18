import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from '../users/entities/user.entity'
import * as bcrypt from 'bcrypt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(email: string, password: string, name: string) {
    const existingUser = await this.userRepository.findOne({
      where: { email },
    })

    if (existingUser) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.')
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      isActive: true,
    })

    await this.userRepository.save(user)

    const payload = { sub: user.id, email: user.email }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }

  async signIn(email: string, password: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'isActive'],
    })

    if (!user) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.')
    }

    if (!user.isActive) {
      throw new UnauthorizedException('비활성화된 계정입니다.')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못되었습니다.')
    }

    const payload = { sub: user.id, email: user.email }
    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
