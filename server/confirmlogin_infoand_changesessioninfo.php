<?php
session_start();
if(isset($_SESSION['key'])){
  echo json_encode(["islog" => true,'user' => "session already in", 'pw' => "session already in"]);
  exit();}
$POST = json_decode(file_get_contents('php://input'),true);

if( isset($POST['user']) && isset($POST['pw'] )){
  $user = $POST['user'];
  $pw = $POST['pw'];
  if ($user === 'foo' and $pw === 'Foobartimes8!'){
    $_SESSION['key'] = 'key';
    //if all goes well and login information is correct
    $arr = array("islog" => true, 'user'=> $user, 'pw' => $pw);
    $msg = json_encode($arr);
    echo $msg;
    exit();
  }
  else {
    echo json_encode(["islog" => false,'user' => "not set", 'pw' => "not set"]); // login information is incorrect
  }
}
else {
  echo json_encode(["islog" => false,'user' => "error", 'pw' => "error"]); //post not set
}
 ?>
