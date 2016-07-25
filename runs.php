<!DOCTYPE html>
<html lang="en">
	<head>
		<?php
		include 'head.php';
		?>
	</head>

	<body>
		<?php
		// include 'analytics.php';
		include 'title.php';
		include 'run_database.php';
		$runIDs = getRuns();
		include 'get_run_info.php';
		$runs = getRunInfos($runIDs);
		$milesPerMeter = 0.000621371;
		?>

		<div class="runs">
			<?php
			foreach ($runs as $run) {
				$distance = $run->distance; // in meters
				$distance *= $milesPerMeter;
				$distance = round($distance, 2);
				$id = $run->_links->self[0]->id;
				$mapUrl = "//snippets.mapmycdn.com/routes/view/embedded/" . $id . "?width=400&height=300&&line_color=E60f0bdb&rgbhex=DB0B0E&distance_markers=1&unit_type=imperial&map_mode=ROADMAP";
			?>
				<div class="run-container">
					<div class="run-info">
						<h3><?php echo $distance; ?> miles</h3>
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
