var nodemailer = require('nodemailer');

class Mailer {
  constructor(config) {
    this.transporter = nodemailer.createTransport(config);
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
    super({
      service: "Outlook365",
      auth: {
        user: PasswordResetMailer.email,
        pass: 'ek2193!!'
      }
    });
  }

  async sendEmail(mailOptions) {
    mailOptions['from'] = this.email;
    return await super.sendEmail(mailOptions);
  }
}

module.exports = { PasswordResetMailer }
