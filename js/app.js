'use-strict';

(function() {

	Handlebars.registerHelper('json', function(context) {
		return "<pre>" + JSON.stringify( context, null, 4 ) + "</pre>";
	});
	Handlebars.registerHelper('badgeColor', function(context) {
		switch( context ) {
		case "status":
			return "info";
		case "photo":
			return "warning";
		default:
			console.log( context );
			return "";
		}
	});
	Handlebars.registerHelper('badgeIcon', function(context) {
		switch( context ) {
		case "status":
			return "glyphicon-edit";
		case "photo":
			return "glyphicon-picture";
		default:
			console.log( context );
			return "glyphicon-edit";
		}
	});
	Handlebars.registerHelper('ifEq', function(var1, var2, options) {
		if( var1 === var2 ) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});
	Handlebars.registerHelper('ifNotThen', function( var1, var2 ) {
		return var1 || var2;
	});
	var regURL = /(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w\.-?&]*)*\/?/i;
	Handlebars.registerHelper('renderBody', function( body ) {
		var newBody = body.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

		// URL Replacement:
		var urls = [];
		var matchCounter = 0;
		while ( true ) {
			var match = regURL.exec( newBody );
			if ( ! match ) {
				break;
			}
			urls[ matchCounter ] = match[0];
			var newNewBody = newBody.slice( 0, match.index ) + "<a class='external-link' data-match='" + matchCounter + "' target='_blank'></a>" + newBody.slice( match.index + match[0].length );
			newBody = newNewBody;
			++ matchCounter;
		}
		var container = $('<div>').html( newBody );
		container.find('a.external-link').each( function() {
			var link = $(this);
			var url = urls[ parseInt( link.attr('data-match'), 10 ) ];
			link.attr( 'href', url ).text( url );
		});

		var preservingSpaces = container.html().split(/[\n\r]+/).join('<br/>');

		return preservingSpaces;
	});
	var regDate = /^([0-9]{4})-([0,1][0-9])-([0-3][0-9])T([0-2][0-9]):([0-6][0-9]):([0-6][0-9])\+([0-9]{4})$/;
	var months = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ];
	var dow = [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun" ];
	function minDig( str, num ) {
		while ( str.length < num ) {
			str = "0" + str;
		}
		return str;
	}
	Handlebars.registerHelper('date', function(context) {
		var res = regDate.exec( context );
		if ( ! res ) {
			return context;
		}
		var hourOffset = parseInt( res[7], 10 ) - 4;
		var dt = new Date( parseInt(res[1], 10), parseInt(res[2], 10) - 1, parseInt(res[3], 10), parseInt(res[4], 10) + hourOffset, parseInt(res[5], 10), parseInt(res[6], 10) );
		var thisYear = ( new Date() ).getYear();
		var hours = dt.getHours();
		var am = hours < 12;
		if ( am && hours === 0 ) hours = 12;
		if ( ! am && hours > 12 ) hours -= 12;
		var out = dow[ dt.getDay() ] + ", " + months[ dt.getMonth() ] + " " + dt.getDate().toString() + ( ( thisYear !== dt.getYear() ) ? ", " + dt.getYear().toString() : "" ) + " - " + hours.toString() + ":" + minDig( dt.getMinutes().toString(), 2 ) + " " + ( am ? "AM" : "PM" );
		// TODO:  continue parsing date
		return out;
	});

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

		var contentSectionA = true;
		var alternation = {};
		Handlebars.registerHelper('alternate', function(str1, str2) {
			var id = JSON.stringify( [ str1, str2 ] );
			if ( alternation[ id ] === undefined ) alternation[ id ] = true;
			var out = alternation[ id ] ? str1 : str2;
			alternation[ id ] = ! alternation[ id ];
			return out;
		});

		config = config || {};
		facebookLoad( config.fb.numberFbPosts || 5, function( err, posts ) {
			if ( err ) {
				console.error( err );
				config.fb.fbPostContainer.html( config.fb.fbErrorTemp( err ) );
				return;
			}
			config.fb.fbPostContainer.html( config.fb.fbPostsTemp( posts ) );
		});
	}

	window.app = init;

})();