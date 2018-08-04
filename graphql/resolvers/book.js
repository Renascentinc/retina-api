// module.exports = {
//   Query: {
//      books: async (a,b,context) => {
//        let response = await context.db.hello_world({part_one: 'We have landed', part_two: 'Oh Yea'});
//        return [{title: response}]
//      }
//   }
// };

module.exports = {
  Query: {
     books: async (a,b,c) => {
       console.log(a,b,c);
       return c.books;
     },
  },
};
