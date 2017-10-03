Parse.Cloud.afterDelete(Parse.User, function(request) {
	var obj = request.object;
	console.log("Start cleanup for User: ", obj.objectId);
	Parse.Promise.when([cleanupSession(obj), cleanupAuth(obj)])
		.then(() => {
			console.log("Cleanup for user: ", obj.objectId, "complete.");
		})
		.catch((err) => {
			console.error("Error during cleanup for user: ", obj.objectId);
			console.error(err);
		})
});

function cleanupSession(user) {
	var query = new Parse.Query("_Session");
	query.equalTo("user", user);
	query.find({ useMasterKey: true})
		.then((results) => {
			Parse.Object.destroyAll(results);
		})
		.catch((err) => {
			console.error(err);
		});
}

function cleanupAuth(user) {
	var query = new Parse.Query("Auth");
	query.equalTo("user", user);
	query.find({ useMasterKey: true })
		.then((results) => {
			Parse.Object.destroyAll(results);
		})
		.catch((err) => {
			console.error(err);
		});
}