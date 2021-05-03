const moment = require("moment");

const formatDate = (date = new Date()) => {
	return moment(date).format("YYYY-MM-DD");
};

const formatDateDetailed = (date = new Date()) => {
	return moment(date).format("YYYY-MM-DD HH:mm:ss");
};

const unixToDetailed = (date) => {
	return moment.unix(date).format("YYYY-MM-DD HH:mm:ss");
};
module.exports = { formatDate, formatDateDetailed, unixToDetailed };
