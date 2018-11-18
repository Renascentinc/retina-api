
const assert = require('assert');
const uuid = require('uuid');
const { renderTemplate }  = require(`utils/template-utils`);

describe('template-utils', function() {

  describe('renderTemplate()', function() {

    it('should successfully render a template', () => {
      let argument1 = uuid();
      let argument2 = uuid();
      let templateArgs = { argument1, argument2 }
      let templatePath = 'tests/templates/template.mustache';

      let renderedTemplate = renderTemplate(templatePath, templateArgs)

      assert(renderedTemplate.includes(argument1))
      assert(renderedTemplate.includes(argument2))
    });

  });

});
