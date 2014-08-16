'use-strict';

(function() {

	var FB_NUMBER_PER_AJAX = 5;

	var facebookLoad = ( function() {
		var loadPage = 0;
		var queue = [];
		function fillFromQueue( arrOut, numberRemaining, cb ) {
			setTimeout( function() {
				if ( queue.length === 0 ) {
					cb( null, arrOut, numberRemaining );
					return;
				}
				if ( queue.length <= numberRemaining ) {
					arrOut = arrOut.concat( queue );
					var newNumberRemaining = numberRemaining - queue.length;
					queue = [];
					cb ( null, arrOut, newNumberRemaining );
					return;
				}
				var piece1 = queue.slice( 0, numberRemaining );
				var piece2 = queue.slice( numberRemaining );
				arrOut = arrOut.concat( piece1 );
				queue = piece2;
				cb( null, arrOut, 0 );
				return;
			}, 0 );
		}
		function ajaxMore( cb ) {
			if ( ! cb ) cb = function() { };
			$.getJSON( 'php/facebook_test.php', { 'p': loadPage }, function( json ) {
				if ( ! Array.isArray( json ) && json.eos ) {
					cb( null, false );
					return;
				}
				queue = queue.concat( json );
				++ loadPage;
				cb( null, true );
			}).fail( function ( jqxhr ) {
				console.error( jqxhr );
				cb( new Error( "Error loading more posts.") );
			});
		}
		return function load( number, callback ) {
			if ( ! number ) number = FB_NUMBER_PER_AJAX;
			numberRemaining = number;
			var arrOut = [];
			function loop() {
				setTimeout( function() {
					if ( numberRemaining <= 0 ) {
						callback( null, arrOut );
						return;
					}
					if ( queue.length === 0 ) {
						ajaxMore( function( err, willContinue ) {
							if ( err ) {
								callback( err );
								return;
							}
							if ( ! willContinue ) {
								// EOS:
								callback( null, arrOut );
								return;
							}
							loop();
						});
						return;
					}
					fillFromQueue( arrOut, numberRemaining, function( err, arrOut_new, numberRemaining_new ) {
						if ( err ) {
							callback( err );
							return;
						}
						arrOut = arrOut_new;
						numberRemaining = numberRemaining_new;
						loop();
					});
				}, 0 );
			}
			loop();
		}
	})();

	function init( config ) {
		facebookLoad( 10, function( err, posts ) {
			if ( err ) console.error( err );
			console.log( posts );
		});
	}

	window.app = init;

})();