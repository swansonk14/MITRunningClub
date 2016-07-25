<!DOCTYPE html>
<html lang="en">
	<head>
		<?php
		include 'head.php';
		?>
	</head>

	<body>
		<?php
			//include 'analytics.php';
			include 'title.php';
			include 'run_database.php';
		?>

		<div class="add-run">
			<p>Copy and paste the url of a <em>public</em> run from MapMyRun.com</p>
			<form action="add_run.php" method="post">
				<input type="text" name="runURL" placeholder="Run url" />
				<input type="submit" />
			</form>
			<?php
			$runURL = $_POST['runURL'];
			if ($runURL) {
				// Want to match id from http://www.mapmyrun.com/routes/view/#########
				if (preg_match("/\/(\d+)\/?$/", $runURL, $matches)) {
					// $matches[1] is the text that matched the first parenthesized
					// subpattern (i.e. the digits in the id)
					$runID = $matches[1];
					addRun($runID);
				} else {
					echo "Invalid MapMyRun URL. URL should be in the format: \"http://www.mapmyrun.com/routes/view/#########\"";
				}
			}
			?>
		</div>
	</body>
</html>
