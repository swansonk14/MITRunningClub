<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL);

require( __DIR__ . "/../config.php" );
require( FACEBOOK_SDK_LOCATION );

use Facebook\FacebookSession;
use Facebook\FacebookRequest;

FacebookSession::setDefaultApplication( FACEBOOK_APP_ID, FACEBOOK_APP_SECRET );

$session = new FacebookSession( FACEBOOK_PUBLIC_ACCESS_TOKEN );

$page = 0;

if ( isset( $_GET['p'] ) ) {
    $page = intval( $_GET['p'] );
    if ( $page < 0 ) {
        $page = 0;
    }
}

/* make the API call */
$offset = NUMBER_PER_PAGE_RESULTS * $page;
$request = new FacebookRequest(
    $session,
    'GET',
    "/" . FACEBOOK_GROUP_ID . "/feed?fields=id,from,message,picture,link,name,caption,description,type,created_time&limit=" . NUMBER_PER_PAGE_RESULTS . "&offset=$offset"
);
$response = $request->execute();
$graphObject = $response->getGraphObject();
/* handle the result */

// var_dump( $graphObject->asArray() );

// var_dump( $graphObject->asArray()['data'] );

$posts = $graphObject->asArray()['data'];

$acceptedPosts = Array();
foreach( $posts as &$post ) {
    if ( isset( $SHOW_POSTS_FROM[ $post->from->id ] ) && $SHOW_POSTS_FROM[ $post->from->id ] ) {
        array_push( $acceptedPosts, $post );
    }
}
// var_dump( $acceptedPosts );
echo json_encode( $acceptedPosts );

?>
