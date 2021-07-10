module.exports = {
	ensureAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			return next();
		}
		req.flash('error_msg', 'Please log in to view this resource')
		res.redirect('/users/login')
	},
	ensureNotAuthenticated: function(req, res, next) {
		if (req.isAuthenticated()) {
			req.flash('error_msg', 'You are already logged in')
			return res.redirect('/dashboard')
		}
		next();	
	},
	loggedIn: function(req) {
		if (req.user) {
			return true;
		} else {
			return false;
		}
	}
}
