<?php
// Set up connection to mlab mongo database
require('vendor/autoload.php');
// TODO: Hide password somewhere
// Connect to database
$mongo_client = new MongoDB\Client('mongodb://MITRunningClub:werun26.2@ds040089.mlab.com:40089/mit_running_club');
// Access running club run collection
$runs = $mongo_client->mit_running_club->runs;

// Get all the runs in the database
function getRuns() {
	global $runs;

	// Get all documents in collection
	$items = $runs->find();
	// Get run ids for each run in the database
	$runIDs = array();
	foreach ($items as $item) {
		$runIDs[] = $item['runID'];
	}

	return $runIDs;
}

// Add a run with the given id to the database
function addRun($runID) {
	global $runs;
	$run = array('runID' => $runID);
	$runInDB = $runs->findOne($run);

	if ($runInDB) {
		echo "Run already in database";
	} else {
		$runs->insertOne($run);
		echo "Run successfully inserted into database";
	}
}
?>