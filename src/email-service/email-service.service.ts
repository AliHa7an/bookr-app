import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class EmailService {
  private readonly templatesDir = path.join(process.cwd(), 'src', 'email-service/email-templates');

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  /**
   * Reads the HTML template from the templates directory.
   * @param templateName - Name of the HTML template file (without extension).
   * @returns The HTML template as a string.
   */
  private loadTemplate(templateName: string): string {
    try {
      const filePath = path.join(this.templatesDir, `${templateName}.html`);
      console.log(filePath, this.templatesDir)
      if (!fs.existsSync(filePath)) {
        throw new Error(`Template "${templateName}" not found`);
      }
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      throw new InternalServerErrorException(`Failed to load template: ${error.message}`);
    }
  }

  /**
   * Sends an email using SendGrid with a specified template.
   * @param to - Recipient's email address.
   * @param subject - Subject of the email.
   * @param templateName - Name of the HTML template (without extension).
   * @param variables - Key-value pairs to replace placeholders in the template.
   * @param from - Sender's email address (optional).
   */
  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string> = {},
    from: string = process.env.SENDGRID_DEFAULT_FROM,
  ): Promise<void> {
    try {
      let htmlTemplate = this.loadTemplate(templateName);

      for (const key of htmlTemplate.match(/{{\s*[\w]+\s*}}/g) || []) {
        const cleanKey = key.replace(/[{}]/g, '').trim();
        const value = variables[cleanKey] || ''; 
        const regex = new RegExp(`{{\\s*${cleanKey}\\s*}}`, 'g');
        htmlTemplate = htmlTemplate.replace(regex, value);
      }

      const msg = {
        to,
        from: { email: 'bookr.temp@gmail.com' },
        subject,
        html: htmlTemplate,
      };

      await sgMail.send(msg);
      console.log(`Email sent to ${to} using template "${templateName}"`);
    } catch (error) {
      console.error('Error sending email:', error.response?.body || error.message);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
