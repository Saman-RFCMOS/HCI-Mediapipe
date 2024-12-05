let videoElement = document.getElementById('webcam');
let gestureResultElement = document.getElementById('gestureResult');

// Initialize MediaPipe Hands model
const hands = new Hands();
hands.setOptions({
  maxNumHands: 1, // Detect only one hand for now
  modelComplexity: 1, // Simple model for faster performance
  minDetectionConfidence: 0.5, // Confidence for detection
  minTrackingConfidence: 0.5, // Confidence for tracking
});

// Initialize webcam and canvas for drawing landmarks
async function setupWebcam() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    videoElement.srcObject = stream;
    videoElement.width = 640;
    videoElement.height = 480;

    // Check if video is playing
    videoElement.onplaying = () => {
      console.log("Webcam video is playing");
    };

    // Create and add canvas element for drawing hand landmarks
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.width;
    canvas.height = videoElement.height;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    // Set canvas to overlay on top of the video
    canvas.style.position = 'absolute';
    canvas.style.top = 0;
    canvas.style.left = 0;

    return ctx;
  } catch (err) {
    console.error("Error accessing webcam:", err);
    alert("Please allow access to the webcam.");
  }
}

// Detect hand gestures and draw landmarks
function processFrame(ctx) {
  hands.send({ image: videoElement });

  hands.onResults((results) => {
    ctx.clearRect(0, 0, videoElement.width, videoElement.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      const landmarks = results.multiHandLandmarks[0]; // First detected hand landmarks

      // Draw landmarks on canvas
      for (let i = 0; i < landmarks.length; i++) {
        const x = landmarks[i].x * videoElement.width;
        const y = landmarks[i].y * videoElement.height;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }

      // Thumbs up gesture detection (thumb tip vs index tip)
      const thumbTip = landmarks[4]; // Thumb tip (landmark 4)
      const indexTip = landmarks[8]; // Index tip (landmark 8)

      if (thumbTip.y < indexTip.y) {
        gestureResultElement.textContent = 'Thumbs Up!';
      } else {
        gestureResultElement.textContent = 'No Thumbs Up Detected!';
      }
    } else {
      gestureResultElement.textContent = 'No hands detected.';
    }
  });
}

// Main function to setup and run hand detection
async function main() {
  const ctx = await setupWebcam();
  processFrame(ctx);
}

// Run the main function
main();
