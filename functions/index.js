const firebase = require("firebase-admin");
const serviceAccount = require("./firebase_key.json");

firebase.initializeApp({
	credential: firebase.credential.cert(serviceAccount),
	databaseURL: "https://atria-f4ce1.firebaseio.com",
});

const { fitbit } = require("./fitbit/routes.js");
const { withings } = require("./withings/routes.js");
const { ml } = require("./machine_learning/routes.js");
const { recommendation } = require("./recommendations/routes.js");

exports.fitbit = fitbit;
exports.withings = withings;
exports.ml = ml;
exports.recommendation = recommendation;
