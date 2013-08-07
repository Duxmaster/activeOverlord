/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function(io) {

	// [1] as soon as this file is loaded, connect automatically, 
	var socket = io.connect();
	if (typeof console !== 'undefined') {
		log('Connecting to Sails.js...');
	}

	socket.on('connect', function socketConnected() {

		//[2] Register listener for 'message'
		// Listen for Comet messages from Sails
		socket.on('message', cometMessageReceivedFromServer);

		///////////////////////////////////////////////////////////
		// Here's where you'll want to add any custom logic for
		// when the browser establishes its socket connection to 
		// the Sails.js server.
		///////////////////////////////////////////////////////////
		log(
			'Socket is now connected and globally accessible as `socket`.\n' +
			'e.g. to send a GET request to Sails, try \n' +
			'`socket.get("/", function (response) ' +
			'{ console.log(response); })`'
		);
		///////////////////////////////////////////////////////////

		// What does this get do? (it subscribes us to the user model)
		socket.get('/user/subscribe/', {
			userIds: slurpUsers()
		}, console.log.bind(console));


		// TODO: show loading spinner
		socket.get('/activity/find', function gotRecentActivity (activities) {
			// TODO: hide loading spinner

			console.log(activities);
			// TODO: Populate the activity feed with activities we found (in our AJAX response)
			// e.g. $.fn.append
		});

	});


	// Expose connected `socket` instance globally so that it's easy
	// to experiment with from the browser console while prototyping.
	window.socket = socket;


	// Simple log function to keep the example simple

	function log() {
		if (typeof console !== 'undefined') {
			console.log.apply(console, arguments);
		}
	}


})(

	// In case you're wrapping socket.io to prevent pollution of the global namespace,
	// you can replace `window.io` with your own `io` here:
	window.io

);


function slurpUsers() {
	console.log('got to slurpUsers()');
	var $users = $('[data-model="user"]');
	var user_ids = [];
	$users.each(function() {
		// this is the user element the tr
		user_ids.push($(this).attr('data-id'));
	});
	return user_ids;
};



function alertDomUserModelUpdated(message) {

	// $("body").append("<div class='alert alert-success'>" + message.data.values.name + "</div>");
	// $(".alert").fadeOut(5000);

	console.log(message);

	$(".navbar").append("<div class='alert alert-success'>" + message.data.value + message.data.action + "</div>");
	$(".alert").fadeOut(5000);

}

/**
 * Logic on how to update a user
 * depends on the page
 *
 * @param {Integer} userId -> the user id
 * @param {Object} changes  -> the changeset from the server (whats new about the user)
 */

function updateUserInDom(userId, changes) {
	// Get the page we're on
	var page = document.location.pathname;

	// Strip trailing slash if we've got one
	page = page.replace(/(\/)$/, '');
	console.log('were on page: ', page);

	// Route to the appropriate user update handler based on the current page
	switch (page) {
		case '/user':
			UserIndexPage.updateUser(userId, changes);
			break;

		case '/user/activity':
			UserActivityPage.updateActivity(changes);
			break;
	}
}

/////////////////////////////////////////////////
// User index page DOM manipulation logic
// (i.e. backbone view)
/////////////////////////////////////////////////
var UserIndexPage = {

	// Logic on how to update a user on the user index page
	updateUser: function(id, changes) {
		if (changes.loggedIn) {
			var $userRow = $('tr[data-id="' + id + '"] td img');
			$userRow.attr('src', "/images/icon-online.png");
		} else {
			var $userRow = $('tr[data-id="' + id + '"] td img');
			$userRow.attr('src', "/images/icon-offline.png");

			//////////////////
			// New Stuff
			///////////////////
			// if (changes.userAdmin) {
			//   var $userRow = $('tr[data-id="' + id+ '"]
			// }
		}
	}	
};

var UserActivityPage = {

	// Logic on how to update a user on the user index page
	updateActivity: function(changes) {
		
		console.log('the changes are: ', changes);
	}	
};



	/**
	 * First you subscribed, now you're anxiously waiting your dear server's messages
	 * They could come at any time.
	 *
	 * [server] --------> browser
	 */

	function cometMessageReceivedFromServer(message) {

		console.log("here's the message: ", message);

		// Looks like this one is an update about a user
		if (message.model === 'user' &&
			message.verb === 'update') {

			// === User id
			if (!message.id) { /* freak out a litle, since.. uh.. which user? */ }

			// Update a user on the page with whatever is in this message
			// In this case, message.data simply contains the boolean online status of the user
			var userId = message.id;
			var changes = message.data;
			updateUserInDom(userId, changes);


			// e.g.
			// changes.online => the new online status of the user

		}

		// If this is a new entry in the activity feed
		else if (message.model === 'activity' &&
				message.verb === 'create') {

			// console.log('New comet message received :: ', message.data.value);

			// var updatedName = message.data.values.name;
			alertDomUserModelUpdated(message);

			// TODO: add it to the thing that shows activities
		}


	}