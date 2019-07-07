
const Mustache = require('mustache')
const { readFileSync } = require('fs');


function renderTemplate(templatePath, templateArgs) {
  const template = readFileSync(templatePath, { encoding: 'utf-8' });
  return Mustache.render(template, templateArgs);
}

module.exports = { renderTemplate }
