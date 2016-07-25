<?php
	include 'run_database.php';

	$runID = $_POST['runID'];

	// error if no runID is given
	if (!$runID) {
		http_response_code(400);
		echo "No run id provided";
		return;
	}

	// Delete run from database
	echo deleteRun($runID);
?>