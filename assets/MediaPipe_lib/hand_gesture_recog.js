const video = document.getElementById('video');
const message = document.getElementById('message');

const hands = new Hands({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.10.3/dist/mediapipe_web/${file}`;
}});

hands.setOptions({
  maxNumHands: 1,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

hands.onResults(onResults);

function onResults(results) {
  // ... (rest of the code)
}

function drawHand(context, handLandmarks) {
  // ... (rest of the code)
}

const camera = new Camera(video);

// Add error handling for camera start
camera.start().catch(error => {
  console.error('Error starting camera:', error);
  message.textContent = 'Error accessing camera. Please check your device settings or try again later.';
});
