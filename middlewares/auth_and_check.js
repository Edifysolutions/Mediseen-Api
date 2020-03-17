module.exports = function(db){
	return {
		requestAuthenticationToken: function (req, res, next){
			db.user.findByToken(req.get("Auth")).then(function(user){
				req.user = user;
				next();
			},	function(e){
				res.status(401).send();
			});
		}
	}
}
