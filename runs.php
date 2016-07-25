<!DOCTYPE html>
<html lang="en">
	<head>
		<?php
		include 'head.php';
		?>
		<script src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js'></script>
		<script src='runs.js'></script>
	</head>

	<body>
		<?php
		// include 'analytics.php';
		include 'title.php';

		// get runs from database
		include 'run_database.php';
		$runIDs = getRuns();
		// get route info from MapMyRun.com
		include 'get_run_info.php';
		$runInfo = getRunInfo($runIDs);

		// sort based on distance
		function cmp($a, $b) {
			$a = $a->distance;
			$b = $b->distance;
			if ($a === $b) {
				return 0;
			}
			return ($a < $b) ? -1 : 1;
		}
		uasort($runInfo, 'cmp');

		$milesPerMeter = 0.000621371;
		?>

		<h1 class="runs-title">MIT Running Club Run Library</h1>

		<div class="add-run">
			<h4 class="add-run-title">Add a run to the database</h4>
			<p>Copy and paste the url of a <em>public</em> run from MapMyRun.com</p>
			<form id="add-run-form">
				<input type="text" id="runURL" placeholder="Run url" />
				<input type="submit" />
			</form>
			<div id="add-run-message"></div>
		</div>

		<div class="runs">
			<?php
			foreach ($runInfo as $run) {
				// initialize distance, id, and url variables
				$distance = $run->distance; // in meters
				$distance *= $milesPerMeter;
				$distance = round($distance, 2);
				$id = $run->_links->self[0]->id;
				$mapUrl = "//snippets.mapmycdn.com/routes/view/embedded/" . $id . "?width=400&height=300&&line_color=E60f0bdb&rgbhex=DB0B0E&distance_markers=1&unit_type=imperial&map_mode=ROADMAP";
			?>
				<div id=<?php echo "run-" . $id; ?> class="run-container">
					<div class="run-info">
						<h3 class="run-distance"><?php echo $distance; ?> miles</h3>
						<button id=<?php echo $id; ?> class="delete-run-button">Delete</button>
					</div>
					<div class="map">
						<iframe class="map-frame" src=<?php echo $mapUrl; ?>></iframe>
					</div>
				</div>
			<?php
			}
			?>
		</div>
	</body>
</html>
