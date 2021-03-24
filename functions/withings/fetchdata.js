const firebase = require("firebase-admin");
var rp = require("request-promise");

const db = firebase.database();
const dataURL = "https://wbsapi.withings.net/measure";

var getBPData = (accesstoken, firebaseUID, date) => {
	const params = {
		action: "getmeas",
		access_token: accesstoken,
	};

	const requestData = {
		method: "GET",
		uri: dataURL,
		qs: params,
		json: true, // Automatically stringifies the body to JSON
	};

	return rp(requestData)
		.then((res) => {
			if (res.status == 401) return res;
			else return ProcessData(firebaseUID, date, res.body || res);
		})
		.catch((err) => {
			return err.response;
		});
};

var ProcessData = (firebaseUID, date, dataObj = {}) => {
	if (!dataObj.measuregrps) return dataObj;

	let formattedData = dataObj.measuregrps.map((d) => {
		let fullDate = new Date(d.created * 1000); //convert from unix format to JS
		let formatedDate =
			fullDate.getFullYear() +
			"-" +
			(fullDate.getMonth() + 1) +
			"-" +
			fullDate.getDate() +
			" " +
			fullDate.getHours() +
			":" +
			fullDate.getMinutes() +
			":" +
			fullDate.getSeconds();

		let diastolic = d.measures[0] ? d.measures[0].value : 0;
		while (diastolic > 300) diastolic /= 10; //manual update adds extra 0s

		let systolic = d.measures[1] ? d.measures[1].value : 0;
		while (systolic > 300) systolic /= 10;

		let hr = d.measures[2] ? d.measures[2].value : 0;
		while (hr > 300) hr /= 10;

		if (diastolic === 0 || systolic === 0) return null;

		return {
			measurement: {
				date: formatedDate,
				diastolic,
				systolic,
				hr,
			},
		};
	});

	let filteredData = formattedData.filter((element) => element);

	return WriteToDb(firebaseUID, date, filteredData);
};
var WriteToDb = (firebaseUID, date, bpData = {}) => {
	return new Promise((resolve) => {
		let user = db.ref(
			"users/" + firebaseUID + "/dailyStats/" + date.toString()
		);
		user.update({
			bp: bpData,
		});
		resolve(bpData);
	});
};
module.exports = { getBPData };
