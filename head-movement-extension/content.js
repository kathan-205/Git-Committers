console.log("Content script is running!");

// Start webcam and display video on screen
function startVideo() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(function (stream) {
      const video = document.createElement('video');
      video.style.position = 'fixed';
      video.style.top = '10px';
      video.style.right = '10px';
      video.style.width = '200px';
      video.style.zIndex = '9999';
      video.style.border = '2px solid black';
      video.srcObject = stream;
      video.autoplay = true;

      document.body.appendChild(video);
    })
    .catch((err) => {
      console.error("Error accessing webcam: ", err);
    });
}

startVideo();
