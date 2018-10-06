// const assert = require('assert');
// const rewire = require('rewire');
//
// const { getDbClientInstance } = require(`${process.env.PWD}/db-client`);
//
// describe('db-client', () => {
//
//   describe('getDbFunctionNames()', () => {
//
//     it('should get function names', async () => {
//       let dbAdapter = await getDbClientInstance();
//       try {
//
//         await dbAdapter.connect();
//         let fn = await dbAdapter.getDbFunctionNames();
//         console.log(fn);
//         await dbAdapter.disconnect();
//       } catch (e) {
//         console.log(e)
//         await dbAdapter.disconnect();
//       }
//     });
//
//   });
//
// });
