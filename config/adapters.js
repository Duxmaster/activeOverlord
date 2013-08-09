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
  
  mongo: {
  

  //   // OR
    module   : 'sails-mongo',
    url      : '',

    // Use this so that only the schema attributes are stored in mongo and not any and all
    // comers form the params
    schema   : true
  }

};