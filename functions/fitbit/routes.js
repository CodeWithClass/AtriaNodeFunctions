const fitbitAuth = require("./auth");
const fitbitData = require("./fetchdata");
const functions = require("firebase-functions");
const express = require("express");
const fitbit = express();
fitbit.use(express.json());
var path = require("path");

fitbit.get("/api/fitbit/auth", (req, res) => {
	let AccessCode = req.query.code;
	let uid = req.query.state;
	if (AccessCode) {
		fitbitAuth
			.AccessToken(AccessCode, uid)
			.then((resp) => {
				if (resp.fbstatus === 200)
					res.sendFile("success.html", {
						root: path.join(__dirname, "../public/fitbitAuth"),
					});
				else
					res.sendFile("failure.html", {
						root: path.join(__dirname, "../public/fitbitAuth"),
					});
			})
			.catch((_err) => {
				console.log(_err);
			});
	} else {
		res.res.status(500).sendFile("failure.html", {
			root: path.join(__dirname, "../public/fitbitAuth"),
		});
	}
});

fitbit.get("/api/fitbit/refresh_token", (req, res) => {
	let refToken = req.query.RefreshToken;
	let firebaseUID = req.query.Uid;
	fitbitAuth
		.RefreshToken(refToken, firebaseUID)

		.then((resp) => {
			res.json({
				resp,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

fitbit.get("/api/fitbit/fetchdata", (req, res) => {
	const fitbitUID = req.query.fitbit_uid;
	const accessToken = req.query.access_token;
	const refreshToken = req.query.refreshToken;
	const firebaseUID = req.query.firebase_uid;
	const date = req.query.date;

	fitbitData
		.makeCall(fitbitUID, accessToken, firebaseUID, date, refreshToken)
		.then((resp) => {
			res.json({
				response: resp,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});
exports.fitbit = functions.https.onRequest(fitbit);
