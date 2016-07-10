<?php
// include('./libs/Requests/library/Requests.php');
// Requests::register_autoloader();

// // TODO: put into environment variables
// $client_key = 'qj8jmmqzzmsq8xbs6wnkuqkdbtku975n';
// $client_secret = 'jFKBgBDKR4D3Jva2eN3teH5vgRamXUTmWXaKJxT2PHw';

// // POST request to get access token
// $access_token_url = 'https://api.mapmyfitness.com/v7.1/oauth2/access_token/';
// $access_token_data = array('grant_type' => 'client_credentials',
//                      'client_id' => $client_key,
//                      'client_secret' => $client_secret);
// $access_token_headers = array('Api-Key' => $client_key);

// $response = Requests::post($access_token_url, $access_token_headers, $access_token_data);
// $response = json_decode($response->body);
// $access_token = $response->access_token;

// // GET request to get route
// $route_url = 'https://api.ua.com/v7.1/route/1072270786/';
// $route_headers = array('Api-Key' => $client_key,
// 				 'authorization' => "Bearer $access_token");

// $response = Requests::get($route_url, $route_headers);
// $response = json_decode($response->body);
// echo 'Distance: ' . $response->distance . 'meters';
// echo 'State: ' . $response->state;

require('vendor/autoload.php');
echo "test";
$mongo_client = new MongoDB\Client('mongodb://MITRunningClub:werun26.2@ds040089.mlab.com:40089/mit_running_club');
echo "test2";
$runs = $mongo_client->MITRunningClub->runs;
$document = array('Distance' => 26);
$runs->insertOne($document);
$items = $runs->find();
foreach ($items as $document) {
	echo $document['Distance'];
}
?>