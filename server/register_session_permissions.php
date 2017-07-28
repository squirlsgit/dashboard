<?php

session_start();
if(isset($_SESSION['key']) && $_SESSION['key'] === 'key'){ echo json_encode(["islog" => true]);} else {echo json_encode(["islog" => false]);}
?>
