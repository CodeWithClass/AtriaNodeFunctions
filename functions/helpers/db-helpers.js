const firebase = require("firebase-admin");
const db = firebase.database();

const WriteToDb = (params) => {
	const { firebaseUID, data, key, path = "" } = params;
	return new Promise((resolve, reject) => {
		let user = db.ref("users/" + firebaseUID + "/" + path);
		user.update({
			[key]: data,
		});
		resolve({ fbstatus: 200, body: data });
		reject({ fbstatus: 401, body: "firebase write has failed" });
	});
};

const PushToDb = (params) => {
	const { firebaseUID, data, path = "" } = params;
	return new Promise((resolve, reject) => {
		let user = db.ref("users/" + firebaseUID + "/" + path);
		user.push(data);
		resolve({ fbstatus: 200, body: data });
		reject({ fbstatus: 401, body: "firebase write has failed" });
	});
};

const ReadFromDb = (params) => {
	const { firebaseUID, path = "" } = params;
	const ref = db.ref("users/" + firebaseUID + "/" + path);

	return ref.once("value", (snapshot) => {
		return snapshot.val();
	});
	//this returns a promise
};

const RemoveFromDb = (params) => {
	const { firebaseUID, toBeRemoved, path = "" } = params;
	console.log("users/" + firebaseUID + path);
	return new Promise((resolve, reject) => {
		let user = db.ref("users/" + firebaseUID + path);
		user.child(toBeRemoved).remove();

		resolve({ fbstatus: 200, body: `${toBeRemoved} removed` });
		reject({ fbstatus: 401, body: "firebase removal has failed" });
	});
};

module.exports = { WriteToDb, PushToDb, ReadFromDb, RemoveFromDb };
