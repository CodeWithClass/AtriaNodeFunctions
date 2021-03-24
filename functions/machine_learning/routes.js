const functions = require("firebase-functions");

const express = require("express");
const ml = express();
ml.use(express.json());
const path = require("path");
const basepyUrl = path.join(__dirname, "./base.py");
const formatMLData = require("./formatData");

ml.get("/api/fitbit/ml", (req, res) => {
	let runPy = new Promise((success, nosuccess) => {
		const { spawn } = require("child_process");
		const pyprog = spawn("python", [basepyUrl]);

		pyprog.stdout.on("data", (data) => {
			success(data);
		});
		pyprog.stderr.on("data", (data) => {
			nosuccess(data);
		});
	});

	runPy
		.then((resp) => {
			let response = formatMLData.formatData(resp);
			res.json({
				response,
			});
		})
		.catch((err) => {
			let error = formatMLData.formatData(err);
			res.json({
				error,
			});
		});
});

exports.ml = functions.https.onRequest(ml);
