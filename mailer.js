var nodemailer = require('nodemailer');

class Mailer {
  constructor(config) {
    this.transporter = nodemailer.createTransport(config);
  }

  async sendEmail(options) {
    // Does this even work?
    return await this.transporter.sendMail(mailOptions, (error, info) => error ? error : info);
  }
}

class PasswordResetMailer extends Mailer {
  constructor() {
    this.email = 'do-not-reply@renascentinc.com';
    super({
      service: "Outlook365",
      auth: {
        user: this.email,
        pass: process.env.DO_NOT_REPLY_EMAIL_PASSWORD
      }
    });
  }

  async sendEmail(options) {
    options['from'] = this.email;
    return await super.sendEmail(options);
  }
}
