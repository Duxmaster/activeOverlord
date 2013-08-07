/**
 * 	SessionController
 *
 *	@module		:: Controller
 * 	@description	:: Contains logic for handling requests.
 */
var bcrypt = require('bcrypt');

module.exports = {

	// new - render sign-in form
	// create - process sign-in form and handle sign-in process
	// destroy - handle sign-out process

	'new': function(req, res) {
		res.view('session/new');
	},

	create: function(req, res, next) {

		// Check for email and password in params sent via the form, if none
		// redirect the browser back to the sign-in form.
		if (!req.param('email') || !req.param('password')) {
			res.redirect('/session/new');
			return;
		}

		// Try to find the user by there email address.
		User.findOneByEmail(req.param('email')).done(function(err, user) {
			if (err) return next(err);

			// If no user is found...
			if (!user) {
				var errors = {
					email: 'The email address ' + req.param('email') + ' not found'
				};
				return res.view('session/new', {
					errors: errors
				});
			}

			// Compare password from the form params to the encrypted password of the user found.
			bcrypt.compare(req.param('password'), user.encryptedPassword, function(err, valid) {
				if (err) return next(err);

				// If the password from the form doesn't match the password from the database...
				if (!valid) {
					var errors = {
						password: 'Invalid username and password combination.'
					};

					// Todo: Create Flash Message with error.
					return res.redirect('session/new');
				}

				// Log user in
				req.session.authenticated = true;
				req.session.User = user;

				// Change status to online
				user.online = true;
				user.save(function(err, user) {
					if (err) return sails.log.error(err);

				// Inform other folks (e.g. connected sockets that are subscribed) that this user is now logged in
				User.publishUpdate( user.id, {
		      		loggedIn: true,
		      		id: user.id
			    });

			    Activity.publishCreate({
    				value: user.name,
    				action: ' has logged in.'
    			});

					// If the user is also an admin redirect to the user list (e.g. /views/user/index.ejs)
					// This is used in conjunction with config/policies.js file
					if (req.session.User.admin) {
						res.redirect('/user');
						return;
					}

					// If the user is not an admin redirect to their profile page (e.g. /views/user/show.ejs)
					res.redirect('/user/show/' + user.id);
				});				
			});
		});
	},

	destroy: function(req, res, next) {

		User.findOne(req.session.User.id, function foundUser (err, user) {

			var userId = req.session.User.id;

			// The user is "logging out" (e.g. destroying the session) so change the online attribute to false.
			User.update(userId, {
				online: false
			}, function (err) {
				if (err) return next(err);

				// Inform other folks (e.g. connected sockets that are subscribed) that the session for this user has ended.
				User.publishUpdate( userId, {
			      loggedIn: false,
			      id: userId
			    });

				// Wipe out the session (log out)
				req.session.destroy();

				Activity.publishCreate({
          value: user.name,
          action: ' has logged out.'
        });

				// Redirect the browser to the sign-in screen
				res.redirect('/session/new');
			});
		});	
	}
};