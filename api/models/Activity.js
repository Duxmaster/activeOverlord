/**
 * Activity
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 *
 */

module.exports = {

  attributes: {
  	
  	/* e.g.
  	nickname: 'string'
  	*/

	  changedById: {
	      type: 'string',
	    },

	  changedByName: {
	  	type: 'string',
	  },

		typeOfChange: {
	      type: 'string',
	    },

	  changedUser: {
	  	type: 'string'
	  }

}

};
