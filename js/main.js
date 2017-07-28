'use strict';
var gumVideo = document.querySelector('video#gum');
var recordedVideo = document.querySelector('video#recorded');
var imageCapture = document.querySelector('canvas#canvas');
var ctx = imageCapture.getContext('2d');
var image = document.querySelector('img#captured');

gumVideo.src = '';
recordedVideo.src = '';

var playButton = document.querySelector('button#play');
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

var constraints = {
  audio: true,
  video: true
};

recordButton.onclick = toggleRecording;
captureButton.onclick = snapshot;
playButton.onclick = play;
downloadButton.onclick = download;
sendButton.onclick =  send;
saveimgButton.onclick = saveImage;
exitButton.onclick = exit;

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
    saveimgButton.disabled = false;
    sendButton.disabled = false;
    image_captured = true;
  }
}
function handleSuccess(stream) {
  recordButton.disabled = false;
  captureButton.disabled = false;
  console.log('getUserMedia() got stream: ', stream);
  window.stream = stream;
  gumVideo.hidden=false;
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
  gumVideo.hidden=true;
  recordedVideo.hidden=false;
  var superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
}

function saveImage() {
  var a = document.createElement('a');
  a.style.display = 'none';
  a.href = image.src;
  a.download = 'test.webp';
  document.body.appendChild(a);
  a.click();
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
  gumVideo.hidden=false;
  recordedVideo.hidden=true;
  if (recordButton.textContent === 'Start Recording') {
    startRecording();
  } else {
    stopRecording();
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
  console.log('Recorded Blobs: ', recordedBlobs);
  recordedVideo.controls = true;
}

function handleStop(event) {
  console.log('Recorder stopped: ', event);
}

function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}
