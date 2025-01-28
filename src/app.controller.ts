import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Handles the root GET request and returns a greeting message
  @Get()
  async getHello(@Res() res: Response): Promise<string> {
    if (res) {
      // Sets cache-control headers to prevent caching of the response
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      // Sends the greeting message fetched from appService
      res.status(200).send(this.appService.getHello());
    } else {
      return "ok"; // Returns a fallback response if no response object is provided
    }
  }

  // Handles the GET request for the favicon and prevents caching
  @Get('favicon.ico')
  async getFavicon(@Res() res: Response): Promise<string> {
    if (res) {
      // Sets cache-control headers to prevent caching of the favicon
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      // Sends an "ok" response for favicon requests
      res.status(200).send("ok");
    } else {
      return "ok"; // Returns a fallback response if no response object is provided
    }
  }
}
