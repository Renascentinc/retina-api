
module.exports = {
  'db.user': process.env.NODE_ENV == 'local' ? process.env.USER : 'coolAwsUser', // May need to change
  'db.host': process.env.NODE_ENV == 'local' ? 'localhost' : 'coolAwsHost',
  'db.database': process.env.NODE_ENV == 'local' ? 'local_db': 'coolAwsDb',
  'db.password': process.env.NODE_ENV == 'local' ? '' : 'superSecretPassword',
  'db.port': 5432,
  'db.schemaDir': `${process.env.PWD}/sql/schema` ,
  'db.functionDir': `${process.env.PWD}/sql/functions`,
  'db.reinitialize': process.env.NODE_ENV == 'local',

  'server.graphql.resolverDir': `${process.env.PWD}/graphql/resolvers`,
  'server.graphql.typeDefDir': `${process.env.PWD}/graphql/type_defs`
}
