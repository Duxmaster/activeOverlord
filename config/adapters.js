/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

  'default': 'mongo',

  // mongo: {



  //   module   : 'sails-mongo',
  //   host     : 'localhost',
  //   user     : 'admin',
  //   password : '1234',
  //   database : 'activeoverlord'

  // }

  mongo: {
  // 'default': 'mongo',

  // // // // sails v.0.9.0
  // // // mongo: {
  // // //   module   : 'sails-mongo',
  // // //   host     : 'localhost',
  // // //   user     : 'username',
  // // //   password : 'password',
  // // //   database : 'your mongo db name here'

  //   // OR
    module   : 'sails-mongo',
    url      : 'mongodb://admin:1234@dharma.mongohq.com:10007/activeoverlord',

    // Use this so that only the schema attributes are stored in mongo and not any and all
    // comers form the params
    schema   : true
  }

  // sails v.0.8.x
  // mongo: {
  //   module   : 'sails-mongo',
  //   url      : 'mongodb://USER:PASSWORD@HOST:PORT/DB'
  // }

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  // 'default': 'mongo'

  // // In-memory adapter for DEVELOPMENT ONLY
  // memory: {
  //   module: 'sails-memory'
  // },

  // // Persistent adapter for DEVELOPMENT ONLY
  // // (data IS preserved when the server shuts down)
  // disk: {
  //   module: 'sails-disk'
  // },

  // // MySQL is the world's most popular relational database.
  // // Learn more: http://en.wikipedia.org/wiki/MySQL
  // mysql: {
  //   module: 'sails-mysql',
  //   host: 'localhost',
  //   user: 'root',
  //   password: '1234',
  //   database: 'overlord'
  // }
};