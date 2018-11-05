
const nodemailer = require('nodemailer');
const appConfig = require('app-config');
const { MailError } = require('error');

class Mailer {
  constructor(mailConfig) {
    this.transporter = nodemailer.createTransport(mailConfig);
  }

  async sendEmail(mailOptions) {
    try {
      return await this.transporter.sendMail(mailOptions);
    } catch (e) {
      throw new MailError(`Failed to send email with error\n${e}`);
    }
  }
}

class PasswordResetMailer extends Mailer {

  constructor() {
    if (!Boolean(appConfig['email.resetPassword.password']) ||
        !Boolean(appConfig['email.resetPassword.address'])) {
      throw new MailError('Reset-password sender email address and password were not supplied');
    }

    super({
      service: "Outlook365",
      auth: {
        user: appConfig['email.resetPassword.address'],
        pass: appConfig['email.resetPassword.password']
      }
    });
  }

}

module.exports = { PasswordResetMailer }
