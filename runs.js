$(document).ready(function () {
	// Submit form to add a run to database
	$("#add-run-form").submit(function (e) {
		// prevent page from submitting
		e.preventDefault();
		// clear previous error messages
		$("#add-run-message").empty();

		// Initialize ajax request
		var xmlhttp = new XMLHttpRequest(),
		// get url with run id
			url = $("#runURL").val(),
		// Want to match id from http://www.mapmyrun.com/routes/view/#########
			runID = url.match(/\/(\d+)\/?$/);

		// Function to execute when request is complete
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === XMLHttpRequest.DONE) {
				var spanClass = "";
				// successful addition to database
				if (xmlhttp.status === 200) {
					spanClass = "success";
					// TODO: better way of bringing in the new run
					window.location.reload();
				}
				// error adding to database
				else if (xmlhttp.status === 400) {
					spanClass = "error";
				}
				// display message
				$("#add-run-message").append("<span class='" + spanClass + "'>" + xmlhttp.responseText + "</span>");
			}
		}

		// check if proper url was given
		if (runID) {
			// get regex match
			runID = runID[1];
			// add run to database
			xmlhttp.open("POST", "add_run.php", true);
			xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xmlhttp.send("runID=" + runID);
		} else {
			// incorrect url format
			$("#add-run-message").append("<span class='error'>Invalid MapMyRun URL. URL should be in the format: \"http://www.mapmyrun.com/routes/view/#########\"</span>");
		}
	});

	// Delete a run from the database
	$(".delete-run-button").click(function () {
		var xmlhttp = new XMLHttpRequest(),
			runID = this.id;

		// Function to execute when request is complete
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState === XMLHttpRequest.DONE) {
				var spanClass = "";
				// successful removal
				// TODO: maybe don't restrict success just to 200?
				if (xmlhttp.status === 200) {
					spanClass = "success";
					// empty html displaying map for the run we just removed
					// since we're not doing a page reload
					$("#run-" + runID).empty();
				} else if (xmlhttp.status === 400) {
					spanClass = "error";
				}
				$("#run-" + runID).append("<div class='delete-run-message'><span class='" + spanClass + "'>" + xmlhttp.responseText + "</span></div>");
			}
		}

		// delete run from database
		xmlhttp.open("POST", "delete_run.php", true);
		xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xmlhttp.send("runID=" + runID);
	})
});