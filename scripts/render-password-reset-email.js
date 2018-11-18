
const uuid = require('uuid');
const { renderTemplate }  = require(`../utils/template-utils`);
const { writeFileSync } = require('fs');
const { exec } = require('child_process');

let templateArgs = {
  appUrl: 'http://retina-develop-us-east-2.s3-website.us-east-2.amazonaws.com',
  passwordResetCredentialsCode: uuid()
}

let templatePath = 'templates/password-reset-email.mustache';

let renderedTemplate = renderTemplate(templatePath, templateArgs)

writeFileSync('rendered_templates/password-reset-email.html', renderedTemplate);

exec('open rendered_templates/password-reset-email.html')
