import { Injectable } from '@nestjs/common';
/**
 * @module App
 */
@Injectable()
export class AppService {
  constructor() {
    if (
      !process.env.SECRET_KEY ||
      !process.env.CONNECTION_STRING ||
      !process.env.EMAIL ||
      !process.env.EMAIL_PASSWORD ||
      !process.env.GOOGLE_CLIENT_ID ||
      !process.env.GOOGLE_SECRET ||
      !process.env.ADMIN_EMAIL ||
      !process.env.FRONT_BASE_URL ||
      !process.env.DRIVE_CLIENT_EMAIL ||
      !process.env.DRIVE_PRIVATE_KEY ||
      !process.env.FIREBASE_CREADENTIAL_TYPE ||
      !process.env.FIREBASE_CREADENTIAL_PROJECT_ID ||
      !process.env.FIREBASE_CREADENTIAL_PRIVATE_KEY_ID ||
      !process.env.FIREBASE_CREADENTIAL_PRIVATE_KEY ||
      !process.env.FIREBASE_CREADENTIAL_CLIENT_ID ||
      !process.env.FIREBASE_CREADENTIAL_CLIENT_EMAIL ||
      !process.env.FIREBASE_CREADENTIAL_AUTH_URI ||
      !process.env.FIREBASE_CREADENTIAL_TOKEN_URI ||
      !process.env.FIREBASE_CREADENTIAL_AUTH_PROVIDER_X509_CERT_URL ||
      !process.env.FIREBASE_CREADENTIAL_CLIENT_X509_CERT_URL
    ) {
      console.error('All Env Variables Should Be Provided To Run The App');
      process.exit();
    }
  }
  getHello(): string {
    return 'Hello World!';
  }
}
