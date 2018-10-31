
const nodemailer = require('nodemailer');
const appConfig = require('app-config');
const { MailError } = require('error');

class Mailer {
  constructor(mailConfig) {
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  async sendEmail(mailOptions) {
    return await this.transporter.sendMail(mailOptions);
  }
}

class PasswordResetMailer extends Mailer {

  static get email() {
    return 'elias@renascentinc.com';
  }

  constructor() {
    if (!Boolean(appConfig['email.resetPassword.password']) ||
        !Boolean(appConfig['email.resetPassword.address'])) {
      throw new MailError('Reset-password sender email address and password were not supplied')
    }

    super({
      service: "Outlook365",
      auth: {
        user: appConfig['email.resetPassword.address'],
        pass: appConfig['email.resetPassword.password']
      }
    });
  }

  async sendEmail(mailOptions) {
    mailOptions['from'] = this.email;
    return await super.sendEmail(mailOptions);
  }
}

module.exports = { PasswordResetMailer }
