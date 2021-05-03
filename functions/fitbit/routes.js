const { ReadFromDb } = require("../helpers/db-helpers");
const { RefreshAndFetch } = require("./auth");
const fitbitAuth = require("./auth");
const functions = require("firebase-functions");
const express = require("express");
const fitbit = express();
fitbit.use(express.json());
var path = require("path");
const _ = require("lodash");

fitbit.get("/api/fitbit/hi", (req, res) => {
	res.redirect("https://atria.coach/fitbitAuth/success");
});

fitbit.get("/api/fitbit/auth", (req, res) => {
	let AccessCode = req.query.code;
	let uid = req.query.state;
	if (AccessCode) {
		fitbitAuth
			.AccessToken(AccessCode, uid)
			.then((resp) => {
				if (resp.fbstatus === 200)
					res.redirect("https://atria.coach/fitbitAuth/success.html");
				else res.redirect("https://atria.coach/fitbitAuth/failure.html");
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

fitbit.get("/api/fitbit/fetchdata", (req, res) => {
	const { firebaseUID, refresh_token, category, date } = req.query;
	fitbitAuth
		.RefreshAndFetch(firebaseUID, refresh_token, category, date)
		.then((resp) => {
			res.json({
				response: resp,
			});
		})
		.catch((err) => {
			return err;
		});
});

//allow fitbit to verify server
fitbit.get("/api/fitbit/webhook", (req, res) => {
	const verificationCode =
		"42ca309719f9695e4824043d3788ea2f41a74cb9396d89012cb846065166f24e";
	if (req.query.verify === verificationCode) res.status(204).send();
	res.status(404).send();
});

fitbit.get("/api/fitbit/revoketoken", (req, res) => {
	//refresh or access token, doesn't matter
	const { token, firebaseUID } = req.query;
	fitbitAuth
		.RevokeToken(token, firebaseUID)
		.then((response) => {
			res.json({
				response,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

fitbit.post("/api/fitbit/webhook", (req, res) => {
	res.status(204).send();

	_.forEach(req.body, (notifi) => {
		const { subscriptionId, collectionType, date } = notifi;
		ReadFromDb({
			firebaseUID: subscriptionId,
			path: "fitbitAuth/refresh_token",
		})
			.then((dataSnapshot) => {
				let refresh_token = dataSnapshot.val();
				if (refresh_token) {
					RefreshAndFetch(subscriptionId, refresh_token, collectionType, date)
						.then(() => {})
						.catch((err) =>
							console.log(
								"err in post.js, endpoint /api/fitbit/webhook doing refreshandfetch",
								err
							)
						);
				}
			})
			.catch((err) => console.log("cant read from db ", err));
	});
});
exports.fitbit = functions.https.onRequest(fitbit);
