const firebase = require("firebase-admin");
const rp = require("request-promise");
const db = firebase.database();
const client_id =
	"5d81605593c6c4e8e1c3871f69fa3ed026659338266b7e27ba07a352bfb6d7fb";
const client_secret =
	"2798f13818cc213ccce23a4c7c6e0e107a2156ff9aeffb275bc8e9eccde4dd63";
const redirect_uri = "https://atria.coach/api/withings/auth";
const TokenURL = "https://account.withings.com/oauth2/token";

const AccessToken = (withingscode, firebaseUID) => {
	const requestBody = {
		client_id,
		client_secret,
		redirect_uri,
		code: withingscode,
		grant_type: "authorization_code",
	};

	const requestData = {
		method: "POST",
		uri: TokenURL,
		form: requestBody,
		json: true, // Automatically stringifies the body to JSON
	};

	return rp(requestData)
		.then((resBody) => {
			return WriteToDb(firebaseUID, resBody);
		})
		.catch((err) => {
			return console.log(err);
		});
};

const RefreshToken = (refresh_token, firebaseUID) => {
	const requestBody = {
		client_id,
		client_secret,
		refresh_token,
		grant_type: "refresh_token",
	};

	const requestData = {
		method: "POST",
		uri: TokenURL,
		form: requestBody,
		json: true, // Automatically stringifies the body to JSON
	};

	return rp(requestData)
		.then((res) => {
			return WriteToDb(firebaseUID, res);
		})
		.catch((err) => {
			return err.response;
		});
};

const WriteToDb = (firebaseUID, AuthObj) => {
	return new Promise((resolve) => {
		let user = db.ref("users/" + firebaseUID);
		user.update({
			withingsAuth: AuthObj,
		});
		resolve({ fbstatus: 200, data: AuthObj });
	});
};
module.exports = { AccessToken, RefreshToken };
