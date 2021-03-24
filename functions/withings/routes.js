const withingsAuth = require("../withings/auth");
const withingsData = require("../withings/fetchdata");
const functions = require("firebase-functions");

const express = require("express");
const withings = express();
withings.use(express.json());
var path = require("path");

withings.get("/api/withings", (req, res) => {
	res.json({
		message: "welcome",
	});
});

withings.get("/api/withings/auth", (req, res) => {
	let AccessCode = req.query.code;
	let uid = req.query.state;
	if (AccessCode) {
		withingsAuth
			.AccessToken(AccessCode, uid)
			.then((resp) => {
				if (resp.fbstatus === 200)
					res.sendFile("success.html", {
						root: path.join(__dirname, "../public/withingsAuth"),
					});
				else
					res.sendFile("failure.html", {
						root: path.join(__dirname, "../public/withingsAuth"),
					});
			})
			.catch((err) => {
				console.log(err);
			});
	} else {
		res.sendFile("failure.html", {
			root: path.join(__dirname, "../public/withingsAuth"),
		});
	}
});

withings.get("/api/withings/refresh_token", (req, res) => {
	let refToken = req.query.RefreshToken;
	let uid = req.query.Uid;
	withingsAuth
		.RefreshToken(refToken, uid)

		.then((resp) => {
			res.json({
				resp,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

withings.get("/api/withings/fetchdata", (req, res) => {
	let accesstoken = req.query.access_token;
	let uid = req.query.Uid;
	let date = req.query.date;

	withingsData
		.getBPData(accesstoken, uid, date)
		.then((resp) => {
			res.json({
				response: resp,
			});
		})
		.catch((err) => {
			console.log(err);
		});
});

exports.withings = functions.https.onRequest(withings);
