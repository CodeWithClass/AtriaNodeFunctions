/* eslint-disable no-unused-vars */
const { ReadFromDb } = require("../helpers/db-helpers");
const { recData } = require("./recommender-data");
const { sumData } = require("./summary-data");
const { WriteToDb } = require("../helpers/db-helpers");

const randomize = () => {
	let rand1 = Math.floor(Math.random() * 4);
	let rand2 = Math.floor(Math.random() * 4);
	while (rand1 === rand2) {
		rand2 = Math.floor(Math.random() * 4);
	}
	return [rand1, rand2];
};

const getRec = (index1, index2) => {
	return [recData[index1], recData[index2]];
};

const getSum = (index) => {
	return sumData[index];
};

const calcRec = async (params) => {
	const { firebaseUID, date } = params;
	const dailyStatsSnapshot = await ReadFromDb({
		firebaseUID,
		path: `dailyStats/${date}`,
	});
	const dailyStats = dailyStatsSnapshot.val();
	const myStatsSnapshot = await ReadFromDb({ firebaseUID, path: "stats" });
	const mystats = myStatsSnapshot.val();

	const rand_indecies = randomize();
	const recommendations = getRec(rand_indecies[0], rand_indecies[1]);
	const summary = getSum(rand_indecies[1]);
	const dbWrite = await WriteToDb({
		firebaseUID,
		data: { recommendations, summary },
		key: "currRec",
	});
	return new Promise((resolve, reject) => {
		resolve(dbWrite);
		reject("no data stored");
	});
};

const process = async (params) => {
	const { firebaseUID, date, data } = params;
	const { id } = data;
	// if (id < 0) reject("data.id less than 0");

	const dbWrite = await WriteToDb({
		firebaseUID,
		data,
		key: id,
		path: `recLog/${date}`,
	});

	return new Promise((resolve, reject) => {
		resolve(dbWrite);
		reject("no data stored");
	});
};

module.exports = { calcRec, process };
