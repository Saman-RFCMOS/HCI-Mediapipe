import { FilesetResolver, GestureRecognizer } from 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/vision_bundle.mjs';

async function initializeGestureRecognizer() {
  // Ensure the MediaPipe library is loaded globally
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  // Create Gesture Recognizer instance with model options
  const gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task"
    },
    numHands: 1
  });

  // Initialize video stream (webcam)
  const videoElement = document.getElementById('video');
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true
  });
  videoElement.srcObject = stream;

  // Wait until the video element is ready
  videoElement.addEventListener('loadeddata', () => {
    console.log('Video stream is ready');
    // Start the render loop
    renderLoop();
  });

  // Set up recognition in video mode
  gestureRecognizer.setOptions({
    runningMode: "video" // Real-time frame processing
  });

  let lastVideoTime = -1;

  // Render loop for real-time gesture recognition
  function renderLoop() {
    if (videoElement.readyState === videoElement.HAVE_ENOUGH_DATA && videoElement.currentTime !== lastVideoTime) {
      try {
        // Process the current video frame with timestamp
        const gestureRecognitionResult = gestureRecognizer.recognizeForVideo(videoElement, videoElement.currentTime * 1000);

        if (gestureRecognitionResult) {
          processResult(gestureRecognitionResult);
        }

        // Update the last processed time
        lastVideoTime = videoElement.currentTime;
      } catch (error) {
        console.error("Error during gesture recognition:", error);
      }
    }

    // Request the next frame
    requestAnimationFrame(renderLoop);
  }
}

// Process the recognition result
function processResult(result) {
  if (result.gestures && result.gestures.length > 0) {
    const gesture = result.gestures[0].categoryName;
    console.log("Detected Gesture:", gesture);

    if (gesture === 'Thumb_Up') {
      // Alert when a "Thumbs Up" gesture is detected
      window.alert("Thumbs Up Detected!");
    }
  }
}

// Start the gesture recognizer when the window loads
window.onload = initializeGestureRecognizer;
