/**
 * ActivityController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	index: function (req, res, next) {

		Activity.count(function findAllActivities (err, total) {
			if (err) return next(err);

			var activitiesTotal = total;	


			var skip = req.param('skip') || 0;
			var activitiesLimit = 10;

			// Get an array of all activities in the Activity collection(e.g. table)
	    Activity.find()
	    .limit(activitiesLimit)
	    .skip(skip)
	    .exec(function foundUsers (err, activities) {
	      if (err) return next(err);

	      var activitiesPages = parseInt(activitiesTotal/activitiesLimit);
	      console.log("activitiesPages: ", activitiesPages);
	      if (activitiesTotal%activitiesLimit > 0) {
	      	var activitiesRemainder = activitiesTotal%activitiesLimit;
	      	activitiesPages++;
	      	console.log("activitiesRemainder: ", activitiesRemainder);
	      }

	      console.log("activitiesPages: ", activitiesPages);
	      console.log("Activities total: ", activitiesTotal);
	      console.log("activitiesLimit: ", activitiesLimit);
	      // pass the array down to the /views/index.ejs page
	      res.view({
	        activities: activities,
	        activitiesTotal: activitiesTotal,
	        activitiesPages: activitiesPages,
	        activitiesLimit: activitiesLimit,
	        skip: skip
	      });
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
