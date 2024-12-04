const video = document.getElementById('webcam');
const canvas = document.getElementById('outputCanvas');
const ctx = canvas.getContext('2d');

let handLandmarkList; // Stores hand landmarks for gesture detection

// Function to handle successful webcam access
function onWebcamLoaded() {
  navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
      video.srcObject = stream;
      processVideo();
    })
    .catch(err => {
      console.error("Error accessing webcam:", err);
    });
}

// Function to process each video frame
function processVideo() {
  const hands = new HandDetection({ maxNumHands: 1 }); // MediaPipe Hand Detection
  hands.onResults(onHandsDetected);
  video.requestVideoFrameAnalysis(processVideo);
}

// Function to handle hand detection results
function onHandsDetected(results) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw hand landmarks if any hands are detected
  if (results.multiHandLandmarks) {
    handLandmarkList = results.multiHandLandmarks[0];
    drawLandmarks(ctx, handLandmarkList, 'red');
    checkHandGesture();
  }
}

// Function to draw hand landmarks on canvas
function drawLandmarks(ctx, landmarks, color) {
  landmarks.forEach(landmark => {
    const [x, y] = landmark;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  });
}

// Function to check for thumbs up/down gesture (simple example)
function checkHandGesture() {
  if (!handLandmarkList) return;

  const wristLandmark = handLandmarkList[0];
  const thumbTip = handLandmarkList[4];

  // Check if thumb tip is above the wrist (thumbs up)
  if (thumbTip.y < wristLandmark.y) {
    console.log("Thumbs Up detected! Call function A here");
  } else if (thumbTip.y > wristLandmark.y) {
    console.log("Thumbs Down detected! Call function B here");
  }
}

// Call onWebcamLoaded function when the page loads
onWebcamLoaded();
