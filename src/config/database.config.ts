import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  database: process.env.DB_NAME || 'booker',
  password: process.env.DB_PASSWORD || 'alihassan@123$',
  username: process.env.DB_USERNAME || 'postgres'
}));