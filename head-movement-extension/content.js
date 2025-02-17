console.log("Content script is running!");

// Load the face-api.min.js script dynamically
function loadFaceApi() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('face_api.min.js'); // Make sure the path is correct
  script.onload = () => {
    console.log("face-api.min.js loaded!");

    // Check if faceapi is now available
    if (window.faceapi) {
      console.log("faceapi is now defined:", window.faceapi);
      loadModels();  // Now, we can safely load models after the script is loaded
    } else {
      console.error("faceapi is still not defined");
    }
  };
  script.onerror = (err) => {
    console.error("Error loading face-api.min.js:", err);
  };

  document.head.appendChild(script);
}

// Load the models using face-api.js with Promise.all
async function loadModels() {
  try {
    const MODEL_URL = chrome.runtime.getURL('models');  // Path to your models folder

    // Ensure that faceapi is defined
    if (!window.faceapi) {
      console.error("faceapi is not defined!");
      return;
    }

    // Load models
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    ]);

    console.log("Models loaded!");
    startVideo();
  } catch (error) {
    console.error("Error loading models:", error);
  }
}

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

      video.addEventListener('playing', () => {
        console.log("Video is playing!");
        detectFaces(video);
      });
    })
    .catch((err) => {
      console.error("Error accessing webcam: ", err);
    });
}

// Detect faces in the video stream
async function detectFaces(video) {
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.style.position = 'fixed';
  canvas.style.top = video.style.top;
  canvas.style.right = video.style.right;
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  }, 100);
}

// Load face-api.js when the content script runs
loadFaceApi();
