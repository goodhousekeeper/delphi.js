<?php

$currName = $_POST["currName"];
$fileContents = json_decode(file_get_contents("https://www.cbr-xml-daily.ru/daily_json.js"));
header('Content-Type: application/json', true);
echo json_encode(($fileContents->Valute->$currName), JSON_UNESCAPED_UNICODE);

exit();
