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
		include 'run_database.php'
		?>

		<div class="runs">
			<div class="run-container">
				<div class="map">
					<iframe class="map-frame" src="//snippets.mapmycdn.com/routes/view/embedded/1072270786?width=400&height=300&&line_color=E60f0bdb&rgbhex=DB0B0E&distance_markers=1&unit_type=imperial&map_mode=ROADMAP&last_updated=2016-05-10T23:02:16-04:00"></iframe>
					<div class="map-links">
						<a target="_blank" href="http://www.mapmyrun.com/routes/create/">Create Routes</a>
						or <a href="http://www.mapmyrun.com/routes/">Search for a route</a>
						from millions at <a href="http://www.mapmyrun.com">MapMyRun</a>
					</div>
				</div>
			</div>
		</div>
	</body>
</html>