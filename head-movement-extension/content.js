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

    console.log("Loading models from:", MODEL_URL);

    // Load models and add logs to check status
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL).then(() => {
        console.log("ssdMobilenetv1 model loaded!");
      }),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL).then(() => {
        console.log("faceLandmark68Net model loaded!");
      })
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
      video.style.width = '200px';  // Set width explicitly
      video.style.height = 'auto';  // Set height to auto to maintain aspect ratio
      video.style.zIndex = '9999';
      video.style.border = '2px solid black';
      video.srcObject = stream;
      video.autoplay = true;video.style.transform = 'scaleX(-1)';  // Mirror the video horizontally
      video.style.transformOrigin = 'center';  // Keep the video centered after mirroring


      document.body.appendChild(video);

      // Wait for video metadata to load (including width and height)
      video.onloadedmetadata = () => {
        console.log("Video metadata loaded:", video.videoWidth, video.videoHeight);

        // Ensure video has valid dimensions before calling faceapi functions
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

// Detect faces in the video stream and log face detection status
let previousPosition = null; // Variable to store previous nose position

async function detectFaces(video) {
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.style.position = 'fixed';
  canvas.style.top = video.style.top;
  canvas.style.right = video.style.right;
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  // Ensure canvas size matches the video size after metadata is loaded
  const displaySize = { width: video.videoWidth, height: video.videoHeight };
  faceapi.matchDimensions(canvas, displaySize);

  setInterval(async () => {
    // Ensure canvas and video dimensions are valid before processing
    if (displaySize.width > 0 && displaySize.height > 0) {
      const detections = await faceapi.detectAllFaces(video).withFaceLandmarks();
      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

      // Log number of faces detected
      console.log("Number of faces detected:", detections.length);

      if (detections.length > 0) {
        const landmarks = detections[0].landmarks;
        const nose = landmarks.getNose();  // Get nose landmark
        const centerX = nose[3].x;  // Using the x-coordinate of the nose (or any other point)

        console.log("Current X Position of the nose:", centerX);

        // You can check for movement by comparing this position with the previous one
        if (previousPosition !== null) {
          const movementThreshold = 30; // Adjusted threshold for higher sensitivity

          // Right movement detection
          if (centerX > previousPosition + movementThreshold) {
            console.log("Rightward movement detected!");
            alert("Rightward movement detected!");  // Optional visual alert
          }

          // Left movement detection
          else if (centerX < previousPosition - movementThreshold) {
            console.log("Leftward movement detected!");
            alert("Leftward movement detected!");  // Optional visual alert
          }
        }

        // Update the previous position
        previousPosition = centerX;
      }
    }
  }, 100);
}

// Load face-api.js when the content script runs
loadFaceApi();
