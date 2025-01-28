import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
    jwtSecret: process.env.JWT_SECRET || 'jwtsecretkey',
    jwtRefreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'jwtRefreshTokenSecretkey',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    jwtRefreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '1d',
    salt: process.env.SALT || 10,
  }));
  