console.log("Content script is running!");

// Load face-api.min.js dynamically
function loadFaceApi() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("face_api.min.js");
  script.onload = () => {
    console.log("face-api.min.js loaded!");
    if (window.faceapi) {
      console.log("faceapi is now defined.");
      loadModels();
    } else {
      console.error("faceapi is not defined!");
    }
  };
  script.onerror = (err) => console.error("Error loading face-api.min.js:", err);
  document.head.appendChild(script);
}

// Load models from the extension directory
async function loadModels() {
  try {
    const MODEL_URL = chrome.runtime.getURL("models");
    if (!window.faceapi) {
      console.error("faceapi is not defined!");
      return;
    }

    console.log("Loading models from:", MODEL_URL);
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
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
    .then((stream) => {
      const video = document.createElement("video");
      video.style.position = "fixed";
      video.style.top = "10px";
      video.style.right = "10px";
      video.style.width = "200px";
      video.style.height = "auto";
      video.style.zIndex = "9999";
      video.style.border = "2px solid black";
      video.style.transform = "scaleX(-1)"; // Mirror effect
      video.srcObject = stream;
      video.autoplay = true;
      document.body.appendChild(video);

      video.onloadedmetadata = () => {
        console.log("Video loaded! Starting face detection...");
        detectFaces(video);
      };
    })
    .catch((err) => console.error("Error accessing webcam:", err));
}

// Movement detection variables
let initialNoseY = null;
let previousNoseX = null;
const moveThresholdX = 30;  // Left/Right movement threshold (more sensitive)
const moveThresholdY = 5;  // Up/Down movement threshold (more sensitive)
const deadzoneY = 30;        // Deadzone to prevent small movements triggering
const cooldownTime = 2000;  // Cooldown to avoid rapid triggering
let canDetectMovement = true;

// Detect faces and recognize movement
async function detectFaces(video) {
  console.log("Detecting faces...");
  setInterval(async () => {
    const detections = await faceapi.detectSingleFace(video).withFaceLandmarks();
    if (!detections) return;

    const landmarks = detections.landmarks;
    const nose = landmarks.getNose()[3]; // Middle of the nose

    // Log nose position for debugging
    console.log(`Nose Position - X: ${nose.x.toFixed(2)}, Y: ${nose.y.toFixed(2)}`);

    if (initialNoseY === null) {
      initialNoseY = nose.y;
      previousNoseX = nose.x;
      console.log("Initial Nose Y Set:", initialNoseY.toFixed(2));
      return;
    }

    const movementX = nose.x - previousNoseX;
    const movementY = nose.y - initialNoseY; // Compare with baseline Y

    console.log(`MovementX: ${movementX.toFixed(2)}, MovementY: ${movementY.toFixed(2)}`);

    if (canDetectMovement) {
      if (Math.abs(movementX) > moveThresholdX) {
        triggerAction(movementX > 0 ? "right" : "left");
      }

      if (Math.abs(movementY) > moveThresholdY) {
        if (movementY > deadzoneY) {
          triggerAction("down");
        } else if (movementY < -deadzoneY) {
          triggerAction("up");
        }
      }
    }

    previousNoseX = nose.x;
  }, 200);
}

// Trigger browser navigation or scroll actions
function triggerAction(direction) {
  console.log(`Triggered Action: ${direction}`);

  // Cooldown to avoid rapid triggering
  canDetectMovement = false;
  setTimeout(() => {
    canDetectMovement = true;
  }, 800); // Adjust cooldown as needed

  if (direction === "right") {
    console.log("Navigating Forward");
    window.history.forward(); // Move forward in history
  } else if (direction === "left") {
    console.log("Navigating Back");
    window.history.back(); // Move back in history
  } else if (direction === "up") {
    window.scrollBy({ top: -500, behavior: "smooth" });
  } else if (direction === "down") {
    window.scrollBy({ top: 500, behavior: "smooth" });
  }
}

// Load face-api.js when the content script runs
loadFaceApi();
