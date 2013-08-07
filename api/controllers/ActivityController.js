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
			// Activity.subscribe(req.socket, activities);
			res.json(activities);
		});
	}

  /* e.g.
  sayHello: function (req, res) {
    res.send('hello world!');
  }
  */
  

};
