module.exports = function(db){
	return {
		requestAuthenticationToken: function (req, res, next){
			db.user.findByToken(req.get("Auth")).then(function(user){
				if (!user) return res.status(401).send();
				req.user = user;
				next();
			},	function(e){
				res.status(401).send();
			});
		}
	}
}
