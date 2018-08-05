

module.exports = {
  Query: {
     books: async (a,b,c) => {
       let result = await c.other_func_wigie({
         first_name: 'Dude',
         last_name: 'Dude'
       });
       console.log(result);
       return c.books;
     },
  },
};
