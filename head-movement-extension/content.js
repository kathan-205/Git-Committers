console.log("Content script is running!");

// Load the face-api.min.js script dynamically
function loadFaceApi() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('face_api.min.js'); // Ensure correct path
  script.onload = () => {
    console.log("face-api.min.js loaded!");
    if (window.faceapi) {
      console.log("faceapi is now defined:", window.faceapi);
      loadModels();
    } else {
      console.error("faceapi is still not defined");
    }
  };
  script.onerror = (err) => {
    console.error("Error loading face-api.min.js:", err);
  };

  document.head.appendChild(script);
}

// Load face-api.js models
async function loadModels() {
  try {
    const MODEL_URL = chrome.runtime.getURL('models'); // Path to models folder
    if (!window.faceapi) {
      console.error("faceapi is not defined!");
      return;
    }

    console.log("Loading models from:", MODEL_URL);

    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
    ]);

    console.log("All models loaded successfully!");
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
      video.style.height = 'auto';
      video.style.zIndex = '9999';
      video.style.border = '2px solid black';
      video.srcObject = stream;
      video.autoplay = true;
      video.style.transform = 'scaleX(-1)';  // Mirror the video horizontally
      video.style.transformOrigin = 'center';  // Keep the video centered after mirroring

      document.body.appendChild(video);

      video.onloadedmetadata = () => {
        console.log("Video metadata loaded:", video.videoWidth, video.videoHeight);

        if (video.videoWidth > 0 && video.videoHeight > 0) {
          detectFaces(video);
        } else {
          console.error("Invalid video dimensions:", video.videoWidth, video.videoHeight);
        }
      };
    })
    .catch((err) => {
      console.error("Error accessing webcam: ", err);
    });
}

// Detect faces and recognize movement
let lastMovement = null; // Stores last detected movement ("left" or "right")
let hasMoved = false; // Prevents multiple detections of the same movement
const movementThreshold = 60; // Degrees required for detection
const deadZone = 15; // Ignores small movements below this threshold
const cooldownTime = 1500; // Cooldown (1.5 seconds) before another movement is detected

async function detectFaces(video) {
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.style.position = 'fixed';
  canvas.style.top = video.style.top;
  canvas.style.right = video.style.right;
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    if (displaySize.width > 0 && displaySize.height > 0) {
      const detections = await faceapi.detectSingleFace(video).withFaceLandmarks();
      if (!detections) return; // Skip if no face detected

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      const landmarks = detections.landmarks;
      const leftEye = landmarks.getLeftEye()[0];
      const rightEye = landmarks.getRightEye()[0];

      // Calculate head tilt angle using atan2
      const deltaY = rightEye.y - leftEye.y;
      const deltaX = rightEye.x - leftEye.x;
      const angle = Math.atan2(deltaY, -deltaX) * (180 / Math.PI);

      console.log("Head tilt angle:", angle);

      // Ignore small movements (dead zone)
      if (Math.abs(angle) < deadZone) {
        return; // Ignore movements within dead zone
      }

      // Stabilized detection logic
      if (!hasMoved) {
        if (angle > movementThreshold && lastMovement !== "right") {
          console.log("Head tilted RIGHT! Triggering right movement.");
          triggerAction("right");
        } else if (angle < -movementThreshold && lastMovement !== "left") {
          console.log("Head tilted LEFT! Triggering left movement.");
          triggerAction("left");
        }
      }
    }
  }, 200); // Reduced checks per second to optimize performance
}

// Function to handle triggering movement
function triggerAction(direction) {
  alert(direction === "right" ? "Left movement triggered!" : "Right movement triggered!");
  lastMovement = direction;
  hasMoved = true;
  setTimeout(() => { hasMoved = false; }, cooldownTime);
}

// Load face-api.js when the content script runs
loadFaceApi();
