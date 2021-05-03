const rp = require("request-promise");
const { WriteToDb } = require("../helpers/db-helpers");
const { formatDate } = require("../helpers/formating");

const fetchData = (
	fitbitUID,
	accessToken,
	firebaseUID,
	category,
	date = null
) => {
	if (!date) date = formatDate();

	const dataURL = `https://api.fitbit.com/1/user/${fitbitUID}/${category}/date/${date}.json`;

	const requestData = {
		method: "GET",
		headers: {
			Authorization: "Bearer " + accessToken,
		},
		uri: dataURL,
		json: true, // Automatically stringifies the body to JSON
		resolveWithFullResponse: true,
	};

	const firebasePath = `dailyStats/${date}`;
	return rp(requestData)
		.then((res) => {
			if (res.statusCode === 200)
				return WriteToDb({
					firebaseUID,
					data: removeSlpMinData(res.body),
					key: category,
					path: firebasePath,
				});
			return res;
		})
		.catch((err) => {
			console.log(err);
			return err;
		});
};

const removeSlpMinData = (data) => {
	let { sleep = [] } = data;
	if (sleep.length < 1) return data;

	data.sleep.filter((element) => {
		delete element.minuteData;
	});
	return data;
};

module.exports = { fetchData };
