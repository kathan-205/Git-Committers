// Get Elements
let webcamFeed = document.getElementById('webcamFeed');
let feedback = document.getElementById('feedback');
let nextButton = document.getElementById('nextButton');

// Function to Request Camera Access
async function startWebcam() {
  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });

    // If permission is granted, show the feed
    webcamFeed.srcObject = stream;
    feedback.textContent = "✅ Webcam access granted!";
  } catch (err) {
    console.error("❌ Webcam access denied:", err);

    if (err.name === "NotAllowedError") {
      feedback.textContent = "⚠ Please allow camera access in browser settings!";
    } else if (err.name === "NotFoundError") {
      feedback.textContent = "⚠ No camera detected!";
    } else {
      feedback.textContent = "⚠ Unable to access the camera!";
    }
  }
}

// Try to start the webcam when the popup opens
document.addEventListener("DOMContentLoaded", () => {
  startWebcam();
});

// Simulated Head Movement Detection
function detectHeadMovement() {
  setInterval(() => {
    let random = Math.random();
    if (random > 0.8) {
      feedback.textContent = "✅ Head turn detected!";
    } else {
      feedback.textContent = "";
    }
  }, 2000);
}

detectHeadMovement();

// Next Page Button Click
nextButton.addEventListener("click", () => {
  console.log("Simulating page flip...");
  feedback.textContent = "📄 Page flipped!";
  setTimeout(() => feedback.textContent = "", 1500);
});
