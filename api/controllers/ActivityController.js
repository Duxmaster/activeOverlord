/**
 * ActivityController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
	

	find: function (req, res, next) {
		// console.log('ActivityController.find() :: Is this working?');
		Activity.find()
		.limit(15)
		.sort('dateCreated DESC')
		.exec( function gotRecentActivity (err, activities) {
			// console.log('Got err :: ', err);
			// console.log('Got activities :: ', activities);
			if (err) return next(err);

			// Subcribe to anything that happens in activities...
			Activity.subscribe(req.socket);

			// Subscribe to anything that happens about Users
			// User.subscribe(req.socket);

			


			// Activity.subscribe(req.socket, activities);
			res.json(activities);
		});
	},

	newUsers: function (req, res, next) {
		User.subscribe(req.socket);
		console.log("Now at the newUser Action.")
	}

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  

};
