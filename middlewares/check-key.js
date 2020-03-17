function checkAPIKey(req, res, next){
	if (req.query.API_KEY == process.env.FREE_API_KEY) {
		next();
	}else if(req.API_KEY){
		next();
	}else{
		res.status(400).json({
			status: "error",
			msg: "Unauthorized access"
		});
	}
}

module.exports = checkAPIKey;