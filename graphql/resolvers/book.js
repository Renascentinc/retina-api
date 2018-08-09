

module.exports = {
  Query: {
     books: async (_, a, db) => {
       let result = await db.other_func_wigie({
         first_name: 'Dude',
         last_name: 'Dude'
       });
       console.log(db);
       return db.books;
     },
  },
};
