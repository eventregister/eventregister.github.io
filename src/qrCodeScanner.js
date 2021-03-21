const theqrcode = window.qrcode;

const video = document.createElement("video");
const canvasElement = document.getElementById("qr-canvas");
const canvas = canvasElement.getContext("2d");

const qrResult = document.getElementById("qr-result");
const outputData = document.getElementById("outputData");
const btnScanQR = document.getElementById("btn-scan-qr");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
var prefilled = urlParams.get("prefilled");
prefilled = decodeURIComponent(prefilled);
// console.log(prefilled);

let scanning = false;

theqrcode.callback = res => {
  if (res) {
    outputData.innerText = res;
    var linkurl = prefilled + res;
    window.location.href = linkurl;
    
    scanning = false;
    video.srcObject.getTracks().forEach(track => {
      track.stop();
    });
    qrResult.hidden = false;
    canvasElement.hidden = true;
    btnScanQR.hidden = false;
  }
};

btnScanQR.onclick = () => {
  while (prefilled == "null" || prefilled == null || prefilled == "") {
    prefilled = window.prompt("輸入報到連結："); 
  }
  navigator.mediaDevices
    .getUserMedia({ video: { facingMode: "environment" } })
    .then(function(stream) {
      scanning = true;
      qrResult.hidden = true;
      btnScanQR.hidden = true;
      canvasElement.hidden = false;
      video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
      video.srcObject = stream;
      video.play();
      tick();
      scan();
    });
};

function tick() {
  canvasElement.height = video.videoHeight;
  canvasElement.width = video.videoWidth;
  canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

  scanning && requestAnimationFrame(tick);
}

function scan() {
  try {
    theqrcode.decode();
  } catch (e) {
    setTimeout(scan, 300);
  }
}
