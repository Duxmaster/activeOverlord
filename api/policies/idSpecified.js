module.exports = function (req, res, next) {
	if (req.param('id')) return next();
	return next('No id specified.');
};