// Get Elements
let webcamFeed = document.getElementById('webcamFeed');
let feedback = document.getElementById('feedback');
let nextButton = document.getElementById('nextButton');

// Start Webcam Stream
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    webcamFeed.srcObject = stream;
  })
  .catch((err) => {
    console.log("Webcam access denied:", err);
    feedback.textContent = "⚠ Webcam access needed!";
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
  }, 2000); // Check every 2 seconds
}

detectHeadMovement();

// Next Page Button Click
nextButton.addEventListener('click', () => {
  console.log("Simulating page flip...");
  feedback.textContent = "📄 Page flipped!";
  setTimeout(() => feedback.textContent = "", 1500); // Clear after 1.5s
});
