<?php
// Set up connection to UnderArmour API to get info from MapMyRun
include('./libs/Requests/library/Requests.php');
Requests::register_autoloader();

// TODO: put into environment variables
$client_key = 'qj8jmmqzzmsq8xbs6wnkuqkdbtku975n';
$client_secret = 'jFKBgBDKR4D3Jva2eN3teH5vgRamXUTmWXaKJxT2PHw';

// POST request to get access token
$access_token_url = 'https://api.mapmyfitness.com/v7.1/oauth2/access_token/';
$access_token_data = array('grant_type' => 'client_credentials',
                     'client_id' => $client_key,
                     'client_secret' => $client_secret);
$access_token_headers = array('Api-Key' => $client_key);

$response = Requests::post($access_token_url, $access_token_headers, $access_token_data);
$response = json_decode($response->body);
$access_token = $response->access_token;

// GET request to get route info from MapMyRun for the given route id
function getRunInfo($runID) {
	global $client_key, $access_token, $route_url, $route_headers;
	$route_url = 'https://api.ua.com/v7.1/route/' . $runID . '/';
	$route_headers = array('Api-Key' => $client_key,
					 'authorization' => "Bearer $access_token");

	$response = Requests::get($route_url, $route_headers);
	$response = json_decode($response->body);
	return $response;
}

// Get route info for all run ids provided
function getRunInfos($runIDs) {
	return array_map('getRunInfo', $runIDs);
}
?>