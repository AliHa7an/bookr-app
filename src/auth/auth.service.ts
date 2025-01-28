import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { SignupInput } from './dto/singup.dto';
import { JwtPayload } from 'src/types/jwt-payload.type';
import { AuthResponse, LoginInput } from './dto/login-response.dto';
import { EmailService } from 'src/email-service/email-service.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async jwtToken(user: User) {
    const accessToken = this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
    return { accessToken, user };
  }

  async loginByEmailPass(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; user: User }> {
    const user = await this.userService.findOneByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid credentials');
    }
    return this.jwtToken(user);
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findOne(payload.id);
  }

  async login(loginInput: LoginInput): Promise<AuthResponse> {
    const { email, password, socialProvider, socialId } = loginInput;

    let user;
    if (socialProvider && socialId) {
      user = await this.userService.findBySocialId(socialProvider, socialId);
      if (!user) {
        throw new Error('User not found!');
      }
    } else if (email && password) {
      user = await this.userService.validateUser(email, password);
      if (!user) {
        throw new Error('Invalid credentials');
      }
    } else {
      throw new Error('Invalid login parameters');
    }

    return this.jwtToken(user);
  }

  async signup(signupInput: SignupInput): Promise<AuthResponse> {
    const { socialProvider, socialId, email, password } = signupInput;

    if (!(socialProvider && socialId) && !(email && password)) {
      throw new Error('Required info for signup is not provided!');
    }

    let user;
    if (socialProvider && socialId) {
      user = await this.userService.findBySocialId(socialProvider, socialId);
      if (user) {
        throw new Error('User already exist');
      }
      if (!user) {
        user = await this.userService.createUser(signupInput);
      }
    } else {
      user = await this.userService.findOneByEmail(signupInput.email);
      if (user) {
        throw new Error('User already exist');
      }
      user = await this.userService.createUser(signupInput);
    }

    return this.jwtToken(user);
  }

  async forgotPassword(email: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    const verificationCode = await this.userService.generateVerificationCode(user);

    await this.emailService.sendEmail(
      email,
      'Forgot Password',
      'forgotPassword',
      { name: user.firstName, code: verificationCode.code }
    );

    return 'Password reset code sent to your email';
  }

  async resetPassword(email: string, code: string, newPassword: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }
    const isValidated = await this.userService.validateVerificationCode(user.id, code);
    if (!isValidated) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userService.updateUser(user.id, hashedPassword);

    return 'Password reset successfully';
  }
}
