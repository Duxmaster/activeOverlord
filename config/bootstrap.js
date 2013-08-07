/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function(cb) {

	// It's very important to trigger this callack method when you are finished 
	// with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)

	// User.findOne(2).done(function(err, user) {

	// 	// Error handling
	// 	if (err) {
	// 		return console.log(err);

	// 		// The User was found successfully!
	// 	} else {
	// 		console.log("User found:", user);
	// 	}
	// 	User.update({}, {
	// 		online: false
	// 	}).done(function(err, users) {
	// 		if (err) {
	// 			console.log(err);
	// 		} else {
	// 			console.log("Users: ", users);
	// 		}
	// 		cb();
	// 	});
	// });
	User.update({}, {
			online: false
	}).done(function(err, users) {
		if (err) {
			console.log(err);
		} else {
			console.log("Users: ", users);
		}
		cb();
	});

};