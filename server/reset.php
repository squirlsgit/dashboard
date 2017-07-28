<?php
session_start();
session_unset();
if(isset($_SESSION['key'])){echo "session still exists";}
 ?>
