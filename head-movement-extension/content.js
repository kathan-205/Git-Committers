console.log("✅ Content script is running!");

// Load face-api.min.js dynamically
function loadFaceApi() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("face_api.min.js");
  script.onload = () => {
    console.log("✅ face-api.min.js loaded!");
    if (window.faceapi) {
      console.log("✅ faceapi is now defined.");
      loadModels();
    } else {
      console.error("❌ faceapi is not defined!");
    }
  };
  script.onerror = (err) => console.error("❌ Error loading face-api.min.js:", err);
  document.head.appendChild(script);
}

// Load models from the extension directory
async function loadModels() {
  try {
    const MODEL_URL = chrome.runtime.getURL("models");
    if (!window.faceapi) {
      console.error("❌ faceapi is not defined!");
      return;
    }

    console.log("🟡 Loading models from:", MODEL_URL);
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    console.log("✅ All models loaded successfully!");
    startVideo();
  } catch (error) {
    console.error("❌ Error loading models:", error);
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
        console.log("✅ Video loaded! Starting face detection...");
        detectFaces(video);
      };
    })
    .catch((err) => console.error("❌ Error accessing webcam:", err));
}

// Variables for movement detection
let initialNoseY = null;
let previousNoseX = null;
const moveThresholdX = 40;  // Left/Right movement threshold
const moveThresholdY = 25;  // Up/Down movement threshold
const deadzoneY = 8;        // Deadzone to prevent small movements triggering
const cooldownTime = 5000;  // 1.5 seconds cooldown
let canDetectMovement = true;

// Detect faces and recognize movement
async function detectFaces(video) {
  console.log("🟡 Detecting faces...");
  setInterval(async () => {
    const detections = await faceapi.detectSingleFace(video).withFaceLandmarks();
    if (!detections) return;

    const landmarks = detections.landmarks;
    const nose = landmarks.getNose()[3]; // Middle of the nose

    if (initialNoseY === null) {
      initialNoseY = nose.y;
      previousNoseX = nose.x;
      console.log("🎯 Initial Nose Y Set:", initialNoseY.toFixed(2));
      return;
    }

    const movementX = nose.x - previousNoseX;
    const movementY = nose.y - initialNoseY; // Compare with baseline Y

    console.log(`📊 MovementX: ${movementX.toFixed(2)}, MovementY: ${movementY.toFixed(2)}`);

    if (canDetectMovement) {
      if (Math.abs(movementX) > moveThresholdX) {
        const direction = movementX > 0 ? "right" : "left";
        alert(`📢 Moving ${direction.toUpperCase()}!`);
        triggerAction(direction);
      }

      if (Math.abs(movementY) > moveThresholdY) {
        if (movementY > deadzoneY) {
          alert("📢 Moving DOWN!");
          triggerAction("down");
        } else if (movementY < -deadzoneY) {
          alert("📢 Moving UP!");
          triggerAction("up");
        }
      }
    }

    previousNoseX = nose.x;
  }, 200);
}

// Detect if the page is a PDF
function isPDF() {
  return window.location.href.includes(".pdf") || 
         document.contentType === "application/pdf" || 
         window.location.href.startsWith("chrome-extension://mhjfbmdgcfjbbpaeojofohoefgiehjai/");
}

// Inject a script to control scrolling in PDFs
function injectScrollScript(direction) {
  const script = document.createElement("script");
  script.textContent = `window.scrollBy({ top: ${direction === "up" ? "-300" : "300"}, behavior: "smooth" });`;
  document.documentElement.appendChild(script);
  script.remove();
}

// Function to trigger scrolling
function triggerAction(direction) {
  console.log(`📜 Moving screen ${direction}!`);

  canDetectMovement = false;
  setTimeout(() => {
    canDetectMovement = true;
  }, cooldownTime);

  if (isPDF()) {
    injectScrollScript(direction);
    return;
  }

  const scrollAmount = 500;
  if (direction === "right") {
    window.scrollBy({ left: scrollAmount, behavior: "smooth" });
  } else if (direction === "left") {
    window.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  } else if (direction === "up") {
    window.scrollBy({ top: -scrollAmount, behavior: "smooth" });
  } else if (direction === "down") {
    window.scrollBy({ top: scrollAmount, behavior: "smooth" });
  }
}

// Load face-api.js when the content script runs
loadFaceApi();
