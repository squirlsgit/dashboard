<?php
if(isset($_FILES['video']['name']))
{$allowedExts = array("jpg", "jpeg", "gif", "png", "mp3", "mp4", "wma","webm","webp");
$extension = pathinfo($_FILES['video']['name'], PATHINFO_EXTENSION);

if ((($_FILES["video"]["type"] == "video/mp4")
|| ($_FILES["video"]["type"] == "audio/mp3")
|| ($_FILES["video"]["type"] == "audio/wma")
|| ($_FILES["video"]["type"] == "image/pjpeg")
|| ($_FILES["video"]["type"] == "image/gif")
|| ($_FILES["video"]["type"] == "image/jpeg")
|| ($_FILES["video"]["type"] == "video/webm")
|| ($_FILES["video"]["type"] == "image/webp")))

  {
  if ($_FILES["video"]["error"] > 0)
    {
    echo "Return Code: " . $_FILES["video"]["error"] . "<br />";
    }
  else
    {
    echo "Upload: " . $_FILES["video"]["name"] . "<br />";
    echo "Type: " . $_FILES["video"]["type"] . "<br />";
    echo "Size: " . ($_FILES["video"]["size"] / 1024) . " Kb<br />";
    echo "Temp video: " . $_FILES["video"]["tmp_name"] . "<br />";

    if (file_exists("upload/" . $_FILES["video"]["name"]))
      {
      echo $_FILES["video"]["name"] . " already exists. ";
      }
    else
      {
      $filename = md5(rand(1,20).time()).'.webm';
      move_uploaded_file($_FILES["video"]["tmp_name"],
      "../upload/" . $filename);
      echo "Stored in: " . "../upload/" . $filename;
      }
    }
  }
else
  {
  echo "Invalid video";
  }
}
else { echo  "no index of video";}
if(!empty($_POST['image'])) {
    $success = false;
    $data = $_POST['image'];
    $filename = md5(rand(1,20).time()).'.webp';

        list($type, $data) = explode(';', $data);
        list(, $data)      = explode(',', $data);
    $data = base64_decode($data);       //decode image

    if(file_put_contents('../upload/'.$filename, $data))  {       //save image to upload folder
        $success = true;
    }
  }
else {
    echo "no index of image";
  }

?>
