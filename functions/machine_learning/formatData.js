let formatData = (data) => {
	let formatedData = new Buffer(data).toString("ascii");
	return formatedData;
};

module.exports = {
	formatData,
};
