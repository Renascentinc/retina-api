// const assert = require('assert');
// const rewire = require('rewire');
//
// const { DbAdapter } = require(`${process.env.PWD}/db-adapter`);
// const { getDbClientInstance } = require(`${process.env.PWD}/db-client`);
//
//
// describe('db-adapter', () => {
//
//   describe('constructor()', () => {
//
//     it('should decorate adapter with function names', async () => {
//       let dbClient = await getDbClientInstance();
//       try {
//         await dbClient.connect();
//         let dbAdapter = await new DbAdapter(dbClient);
//         // dbAdapter.get_func_wigie()
//         await dbClient.disconnect();
//       } catch (e) {
//         console.log(e)
//         await dbClient.disconnect();
//       }
//
//     });
//
//   });
//
// });
