'use strict';
var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');
var imageCapture = document.querySelector('canvas#canvas');
var ctx = imageCapture.getContext('2d');
var image = document.querySelector('img#captured');
var videostream = document.querySelector('progress#videostream');
gumVideo.src = '';
recordedVideo.src = '';

var playButton = document.querySelector('button#play');
var pauseButton = document.querySelector('button#pause');
var flipButton = document.querySelector('button#flip');
var captureButton = document.querySelector('button#capture');
var downloadButton = document.querySelector('button#download');
var saveimgButton = document.querySelector('button#saveimg');
var sendButton = document.querySelector('button#send');
var recordButton = document.querySelector('button#record');
var exitButton = document.querySelector('button#exit');


var mediaRecorder;
var recordedBlobs;
var sourceBuffer;
var image_captured = false;
/*
var isSecureOrigin = location.protocol === 'https:' ||
location.hostname === 'localhost' || location.hostname === '127.0.0.1';
if (!isSecureOrigin) {
  alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
    '\n\nChanging protocol to HTTPS');
  location.protocol = 'HTTPS';
}*/

var front = false;
flipButton.onclick = function() { front = !front; };
var constraints = {
  audio: true,
  video: { facingMode: (front? "user" : "environment") }
};

recordButton.onclick = toggleRecording;
captureButton.onclick = snapshot;
playButton.onclick = play;
pauseButton.onclick = pause;
downloadButton.onclick = download;
sendButton.onclick =  send;
saveimgButton.onclick = saveImage;
exitButton.onclick = exit;





recordedVideo.onended = function(){
  playButton.disabled = false;
  pauseButton.disabled = true;
  recordedVideo.style.filter = "brightness(50%)";
};

recordedVideo.onplay = function(){
  if(videostream.hidden){
    videostream.hidden = false;
    /*videostream.max = 100;
    videostream.value = recordedVideo.currentTime/recordedVideo.duration;
    console.log("max: "  + videostream.max + ", current: "+ videostream.value)*/
  }
  recordedVideo.style.filter = "brightness(100%)";
  setTimeout(console.log("max: "  + recordedVideo.duration + ", current: "+ recordedVideo.currentTime),100);
}
gumVideo.muted = true;

function exit() {
  if(stream){

    stream.getAudioTracks()[0].stop();
stream.getVideoTracks()[0].stop();

}
}
function snapshot() {
  if(stream) {
    imageCapture.width = gumVideo.videoWidth;
    imageCapture.height = gumVideo.videoHeight;
    console.log(imageCapture.width + ", " + imageCapture.height);
    image.width = gumVideo.videoWidth;
    image.height = gumVideo.videoHeight;
    console.log(image.width + ", " + image.height);
    ctx.drawImage(gumVideo,0,0,image.width,image.height);
    image.src = imageCapture.toDataURL('image/webp');
    gumVideo.style.display="none";
    image.style.display="block";
    saveimgButton.disabled = false;
    sendButton.disabled = false;
    recordButton.disabled = true;
    captureButton.disabled = true;
    flipButton.disabled = true;
    image_captured = true;
  }
}
function handleSuccess(stream) {
  recordButton.disabled = false;
  captureButton.disabled = false;
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream;
  gumVideo.style.display="block";
  if (window.URL) {
    console.log('window url returned valid');
    gumVideo.srcObject = stream;

  } else {
    console.log('window url returned invalid');
  }
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

function play() {
  console.log("play video");
  recordedVideo.style.display = "block";
  recordButton.disabled = true;
  captureButton.disabled = true;
  var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    recordedVideo.play();
    pauseButton.disabled = false;
    playButton.disabled = true;
}
function pause() {
  recordedVideo.pause();
  playButton.disabled = false;
  pauseButton.disabled = true;
}

function saveImage() {
  if(image.src){
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = image.src;
    a.download = 'test.webp';
    document.body.appendChild(a);
    a.click();
  }
}
function download() {
  var blob = new Blob(recordedBlobs, {type: 'video/webm'});
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'test.webm';
  document.body.appendChild(a);
  a.click();
  setTimeout(function() {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
}

function send() {
  var xhr = new XMLHttpRequest();
  var videoData = new FormData();
  if(recordedBlobs){console.log('recordedblobs exists');var sendblob = new Blob(recordedBlobs, {type: 'video/webm'});
  videoData.append('video', sendblob);}
  if(image_captured){
    console.log('captured image had an src.');
    videoData.append('image', image.src);
}
  xhr.open("POST", 'server/SaveVideo.php', true);
  xhr.onreadystatechange = function() {
      if(xhr.readyState == 4 && xhr.status == 200) {
          var return_data = xhr.response;
          console.log(return_data);
      }
  };
  xhr.send(videoData);
  console.log("processing...");
//  window.location.href = "send.html";
}
function toggleRecording() {
  //set videos and images to defualt for maintanability reasons.
  gumVideo.style.display="block";
  image.style.display="none";
  recordedVideo.style.display="none";
  if (recordButton.textContent.match(/.*Start Recording.*/)) {
    console.log('start recording');
    startRecording();
  } else {
    console.log('stop recording');
    stopRecording();
    /*  original btn primary styling: color: #fff;
  background-color: #337ab7;
  border-color: #2e6da4;*/
    recordButton.textContent = 'Start Recording';
    playButton.disabled = false;
    downloadButton.disabled = false;
    sendButton.disabled = false;
    captureButton.disabled = false;
  }
}

function startRecording() {
  recordedBlobs = [];
  var options = {mimeType: 'video/webm;codecs=vp9'};
  if (!MediaRecorder.isTypeSupported(options.mimeType)) {
    console.log(options.mimeType + ' is not Supported');
    options = {mimeType: 'video/webm;codecs=vp8'};
    if (!MediaRecorder.isTypeSupported(options.mimeType)) {
      console.log(options.mimeType + ' is not Supported');
      options = {mimeType: 'video/webm'};
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        console.log(options.mimeType + ' is not Supported');
        options = {mimeType: ''};
      }
    }
  }
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder: ' + e);
    alert('Exception while creating MediaRecorder: '
      + e + '. mimeType: ' + options.mimeType);
    return;
  }
  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  captureButton.disabled = true;
  downloadButton.disabled = true;
  sendButton.disabled = true;
  mediaRecorder.onstop = handleStop;
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start(10); // collect 10ms of data
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  gumVideo.style.display = "none";
  flipButton.disabled = true;
  if(stream){
    stream.getAudioTracks()[0].stop();
    stream.getVideoTracks()[0].stop();
}
  console.log('Recorded Blobs: ', recordedBlobs);
  //recordedBlobs.onloadend = play; #blob event for onloaded data
  setTimeout(play, 25); //delays by 25 milleseconds for encoding.
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}
