const functions = require("firebase-functions");

const express = require("express");
const recommendation = express();
recommendation.use(express.json());
const recommender = require("./recommender");
const _ = require("lodash");

recommendation.get("/api/withings", (req, res) => {
	res.json({
		message: "welcome",
	});
});

recommendation.get("/api/recommendation/generate", (req, res) => {
	const { firebaseUID, date } = req.query;
	recommender
		.calcRec({ firebaseUID, date })
		.then((resp) => {
			res.json({
				response: resp,
			});
		})
		.catch((err) => {
			console.log(err);
			res.json({
				error: err,
			});
		});
});

recommendation.post("/api/recommendation/process", (req, res) => {
	const { firebaseUID, date } = req.query;
	const data = req.body || {};

	if (_.isEmpty(data))
		return res.json({
			response: "no data in request body",
		});

	recommender
		.process({
			firebaseUID,
			date,
			data,
		})
		.then((resp) => {
			res.json({
				response: resp,
			});
		})
		.catch((err) => {
			console.log(err);
			res.json({
				error: err,
			});
		});
});

exports.recommendation = functions.https.onRequest(recommendation);
