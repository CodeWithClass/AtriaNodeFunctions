function sendMsg() {
	const data = getFormData($("#contact-form"));

	$("#loading-message").removeClass("d-none");
	$("#contact-form").addClass("d-none");

	const url =
		"https://us-central1-coderehack-dotcom.cloudfunctions.net/contactUs/contact_codeRehack";
	fetch(url, {
		method: "POST",
		body: JSON.stringify(data),
	})
		.then((_res) => {
			$("#loading-message").addClass("d-none");
			$("#response-message").removeClass("d-none");
		})
		.catch((_e) => {
			$("#loading-message").addClass("d-none");
			$("#contact-form").removeClass("d-none");
			$("#error-message").removeClass("d-none");
		});
}

function getFormData($form) {
	const unindexed_array = $form.serializeArray();
	let indexed_array = {};

	$.map(unindexed_array, function (n, i) {
		indexed_array[n["name"]] = n["value"];
	});

	return indexed_array;
}
