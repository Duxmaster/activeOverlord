/**
 * Allow a logged-in user to see, edit and update her own profile
 * Allow admins to see everyone
 */

module.exports = function(req, res, ok) {

	// User is not signed in at all
	if (!req.session.User) {
		return notAllowed('Not allowed. Please log in.', '/session/new');
	}

	// This is for mysql because mysql stores id's as ints and the params are strings
	// Cast both sides to make sure they're converted from strings to integers
	// var sessionUserMatchesId = 
	// 	+req.session.User.id === +req.param('id');

	var sessionUserMatchesId = req.session.User.id === req.param('id');
	var isAdmin = req.session.User.admin;

	// The requested id does not match the user's id,
	// and this is not an admin
	if (!(sessionUserMatchesId || isAdmin)) {
		return notAllowed('Only admins can view other user\'s profiles. ' +
			'\nYou are ' + (req.session.User.admin ? '' : 'not ') + 'an admin.' +
			'You are trying to view user ' + req.param('id') + '\'s profile, but you are ' +
			'user ' + req.session.User.id, '/session/new');
	}

	ok();

	function notAllowed(message, redirectTo) {

		sails.log.warn(message);
		if (req.wantsJSON) {
			res.json({
				status: 403,
				error: message
			});
			return;
		}
		req.session.flash = message;
		res.redirect(redirectTo);
		return;
	}
};