/**
 * UserController
 *
 * @module    :: Controller
 * @description :: Contains logic for handling requests.
 */

module.exports = {

  // index - Lists all users (user.admin must be 'true' to view this page.), see /config/policies.js for the index policy
  // new - render the sign-up form
  // create - add a user to the user collection (e.g. table)
  // show - render the user profile page, see also /config/policies.js for the show policy

  index: function (req, res, next) {

    // Get an array of all users in the User collection(e.g. table)
    User.find(function foundUsers (err, users) {
      if (err) return next(err);
      // pass the array down to the /views/index.ejs page
      res.view({
        users: users
      });
    });
  },

  // render the sign-up view (e.g. /views/new.ejs)
  'new': function (req, res) {
    res.view();
  },

  // process the sign-up form
  create: function (req, res, next) {

    // Create a User with the params sent from the sign-up form
    User.create( req.params.all(), function userCreated (err, user) {
      if (err) return next(err);

      // Log user in
      req.session.authenticated = true;
      req.session.User = { 
        id: user.id, 
        admin: user.admin 
      };

      // Let other's know whose logging in
      Activity.publishCreate({
        value: user.name,
        action: ' has been created and logged in.'
      });

      // Let the index page know that a user was created.
      User.publishCreate({
        user: user
      });


      res.redirect('/user/show/'+user.id);
    });
  },

  // render the profile view (e.g. /views/show.ejs)
  show: function (req, res, next) {
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next();
      res.view({
        user: user
      });
    });
  },

  // render the edit view (e.g. /views/edit.ejs)
  edit: function (req, res, next) {

    // Find the user from the id passed in via params
    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);
      if (!user) return next();
      
      res.locals.user = user;
      res.view();

      // Equivalent ^
      ///////////////////
      // res.view({
      //   user: user
      // });
    });
  },

  // process the info from edit view
  update: function (req, res, next) {
    User.update(req.param('id'), req.params.all(), function userUpdated (err) {
      if (err) {
        sails.log.error(err);
        return res.redirect('/user/edit/' + req.param('id'));
      }

    // NEW STUFF ZZZ
    Activity.publishCreate({
      value: req.param('name'),
      action: ' has been updated.'
    });

      res.redirect('/user/show/' + req.param('id'));
    });
  },

  destroy: function (req, res, next) {

    User.findOne(req.param('id'), function foundUser (err, user) {
      if (err) return next(err);

      if (!user) return next('User doesn\'t exist.');

      User.destroy(req.param('id'), function userDestroyed(err) {
        if (err) return next(err);

          // console.log("This is before I find:", req.param('id'));

          // User.findOne(req.param('id')).exec(function foundUser (err, user) {

          // console.log("This is after I find:", req.param('id'));

          Activity.publishCreate({
            value: user.name,
            action: ' has been deleted.'
          });

          console.log("This is at the destroy action for user.id", user.id);
          console.log("This is at the destroy action for user.name", user.name);


          // Let the index page know that a user was deleted.
          User.publishDestroy({user: user});
      });

      res.redirect('/user');  
      
    });
  },
  
  // socket.get('/user/subscribe/3223325', { userIds: theUsers }, console.log.bind(console))
  subscribe: function (req, res, next) {
    sails.log.debug('Subscribing to users ' + req.param('userIds'));

    var listOfNumbers= req.param('userIds');
    // console.log('this is what the userIds looks like: ', req.param('userIds'));
    var listOfPseudoModels = _.map(listOfNumbers, function (id) {
      return { id: id };
    });
     console.log('this is what the listofPseudoModels looks like: ', listOfPseudoModels);
    User.subscribe(req.socket, listOfPseudoModels);

    // res.json(
    //   {'some_json': 'it worked!'}
    // );
  }
};