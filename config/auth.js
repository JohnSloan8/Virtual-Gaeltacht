module.exports = {
	ensureAuthenticated: function(req, res, next) {
		console.log('in ensureAuthenticated')
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
	},
	isInvited: function(req, res, next) {
		if (Object.keys(req.query).length > 0) {
			if (req.query['inviter'] !== undefined) {
				req.session.invitedChat = req.params.id	
				req.session.inviter = req.query.inviter
			}
		}
		return next();
	},
	removeInvite: function(req, res, next) {
		if (req.session.invitedChat !== undefined) {
			delete req.session.invitedChat
		}
		if (req.session.inviter !== undefined) {
			delete req.session.inviter
		}
		return next();
	}
}
