/**
 * ActivityController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	index: function (req, res, next) {

	// Get an array of all activities in the Activity collection(e.g. table)
    Activity.find(function foundUsers (err, activities) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        activities: activities
      });
    });
	},
	

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
