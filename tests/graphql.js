const assert = require('assert');

const { createSchema } = require('../utils/graphql-utils');
const { graphql } = require('graphql');

describe('Api usage', async () => {

  describe('get_tool()', () => {

    it('gets a tool', async () => {
      let schema = createSchema();

      query = `
        query {
          getTool(tool_id: 1) {
            id
            brand_id
          }
        }
      `
      let tool = {
        id: 'dsfdfajoife83248',
        brand_id: 3
      }

      let context = {
        db: {
          get_tool: () => ([tool])
        },
        session: {
          organization_id: 100
        }
      }

      let result = await graphql(schema, query, null, context);
      assert.deepEqual(result.data.getTool, tool)
    });

  });

});
